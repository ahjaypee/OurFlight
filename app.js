document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('itinerary-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const CACHE_KEY = 'cachedItineraryData';
    
    // Define icons for each category
    const typeIcons = {
        flight: '✈️',
        train: '🚆',
        car: '🚗',
        hotel: '🏨',
        excursion: '🍳'
    };

    // Sort all data chronologically by date and time
    itineraryData.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));

    let cachedData = JSON.parse(localStorage.getItem(CACHE_KEY)) || [];

    // Function to draw the cards on the screen
    function renderCards(filterType = 'all') {
        container.innerHTML = ''; // Clear current cards

        itineraryData.forEach((item, index) => {
            // Skip this card if it doesn't match the active filter
            if (filterType !== 'all' && item.type !== filterType) return;

            let isChanged = false;
            if (cachedData.length > 0 && cachedData[index]) {
                const oldItem = cachedData[index];
                if (oldItem.time !== item.time || oldItem.date !== item.date || oldItem.reference !== item.reference) {
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

            card.innerHTML = `
                ${isChanged ? '<div class="changed-badge">UPDATED</div>' : ''}
                <div class="route">
                    <span>${item.startPoint}</span>
                    <span>${typeIcons[item.type] || '📍'}</span>
                    <span>${item.endPoint}</span>
                </div>
                <div class="details">
                    <div class="datetime">
                        <span class="date">${item.date}</span>
                        <span class="time">${item.time}</span>
                    </div>
                    <div class="flight-number">${item.reference}</div>
                </div>
                <div class="airline">${item.title}</div>
                
                <div class="button-group">
                    <a href="${item.link1Url}" target="_blank" class="action-btn primary-btn">${item.link1Text}</a>
                    <a href="${item.link2Url}" target="_blank" class="action-btn secondary-btn">${item.link2Text}</a>
                </div>
            `;

            container.appendChild(card);
        });
    }

    // Handle filter button clicks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to the clicked button
            e.target.classList.add('active');
            // Re-draw the screen with the new filter
            renderCards(e.target.dataset.filter);
        });
    });

    // Initial draw
    renderCards();
    localStorage.setItem(CACHE_KEY, JSON.stringify(itineraryData));
});
