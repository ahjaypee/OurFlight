document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('itinerary-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // NEW: Load hidden items from local storage (so it persists between visits)
    let hiddenItems = JSON.parse(localStorage.getItem('hiddenItineraryItems')) || [];

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

    function renderCards(filterType = 'all') {
        container.innerHTML = ''; 

        itineraryData.forEach((item) => {
            // Create a unique ID for each item so we know exactly which one to hide
            const itemId = item.reference + item.date;
            const isHidden = hiddenItems.includes(itemId);

            // NEW: Filtering logic for hidden items
            if (filterType === 'hidden') {
                if (!isHidden) return; // Only show hidden items in the 'hidden' tab
            } else {
                if (isHidden) return; // Hide these items from all other tabs
                if (filterType !== 'all' && item.type !== filterType) return; // Standard category filter
            }

            const itemDateTime = new Date(`${item.date} ${item.time}`);
            const now = new Date();
            const isPast = itemDateTime < now;

            const card = document.createElement('div');
            
            let classNames = ['flight-card'];
            if (isPast) classNames.push('past');
            card.className = classNames.join(' ');

            card.addEventListener('click', (e) => {
                if (e.target.closest('.action-btn')) return;
                card.classList.toggle('expanded');
            });

            // Set up the hide/unhide button ONLY if the event is in the past
            let hideBtnHTML = '';
            if (isPast) {
                if (isHidden) {
                    hideBtnHTML = `<button class="action-btn toggle-hide-btn" data-id="${itemId}">👁️ Unhide</button>`;
                } else {
                    hideBtnHTML = `<button class="action-btn toggle-hide-btn" data-id="${itemId}">👻 Hide</button>`;
                }
            }

            // Set up the Weather button for hotels
            let weatherBtnHTML = '';
            if (item.type === 'hotel') {
                weatherBtnHTML = `<a href="https://www.google.com/search?q=current+weather+${encodeURIComponent(item.startPoint)}" target="_blank" class="action-btn weather-btn">⛅ Weather</a>`;
            }

            card.innerHTML = `
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
                        ${weatherBtnHTML}
                        ${hideBtnHTML}
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    }

    // Handle standard filter button clicks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderCards(e.target.dataset.filter);
        });
    });

    // NEW: Listen for clicks on the Hide/Unhide buttons
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('toggle-hide-btn')) {
            const itemId = e.target.getAttribute('data-id');
            
            if (hiddenItems.includes(itemId)) {
                // Remove from hidden list
                hiddenItems = hiddenItems.filter(id => id !== itemId);
            } else {
                // Add to hidden list
                hiddenItems.push(itemId);
            }
            
            // Save to the phone's local storage
            localStorage.setItem('hiddenItineraryItems', JSON.stringify(hiddenItems));
            
            // Re-draw the screen in whatever filter tab you are currently looking at
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            renderCards(activeFilter);
        }
    });

    renderCards();
});
