document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('itinerary-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const CACHE_KEY = 'cachedItineraryData';
    
    const typeIcons = {
        flight: '✈️',
        train: '🚆',
        car: '🚗',
        hotel: '🏨',
        excursion: '🍳'
    };

    if (typeof itineraryData === 'undefined') {
        container.innerHTML = '<p style="text-align:center; padding: 30px; color: #ffba08;">⚠️ Could not load data.js. Please check the file name and your index.html links.</p>';
        return;
    }

    // Sort chronologically
    itineraryData.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));

    let cachedData = JSON.parse(localStorage.getItem(CACHE_KEY)) || [];

    function renderCards(filterType = 'all') {
        container.innerHTML = ''; 

        itineraryData.forEach((item) => {
            if (filterType !== 'all' && item.type !== filterType) return;

            let isChanged = false;
            if (cachedData.length > 0) {
                const oldItem = cachedData.find(old => old.reference === item.reference);
                if (oldItem && (oldItem.time !== item.time || oldItem.date !== item.date)) {
                    isChanged = true;
                }
            }

            const itemDateTime = new Date(`${item.date} ${item.time}`);
            const now = new Date();
            const isPast = itemDateTime < now;

            const card = document.createElement('div');
            
            let classNames = ['flight-card'];
            if (isChanged) classNames.push('changed');
            if (isPast) classNames.push('past');
            card.className = classNames.join(' ');

            // Make the card clickable to toggle expansion
            card.addEventListener('click', (e) => {
                // Prevent toggling if clicking directly on a button link
                if (e.target.closest('.action-btn')) return;
                card.classList.toggle('expanded');
            });

            // New Accordion Structure
            card.innerHTML = `
                ${isChanged ? '<div class="changed-badge">UPDATED</div>' : ''}
                
                <div class="card-summary">
                    <div class="summary-icon">${typeIcons[item.type] || '📍'}</div>
                    <div class="summary-route">
                        <div class="route-text">${item.startPoint} ➔ ${item.endPoint}</div>
                        <div class="route-date">${item.date} • ${item.time}</div>
                    </div>
                    <div class="expand-icon">▼</div>
                </div>

                <div class="card-details">
                    <div class="details-header">
                        <div class="flight-number">${item.reference}</div>
                        ${item.pnr ? `<div class="pnr-badge">PNR: ${item.pnr}</div>` : ''}
                    </div>
                    <div class="airline">${item.title}</div>
                    
                    <div class="button-group">
                        <a href="${item.link1Url}" target="_blank" class="action-btn primary-btn">${item.link1Text}</a>
                        <a href="${item.link2Url}" target="_blank" class="action-btn secondary-btn">${item.link2Text}</a>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderCards(e.target.dataset.filter);
        });
    });

    renderCards();
    localStorage.setItem(CACHE_KEY, JSON.stringify(itineraryData));
});
