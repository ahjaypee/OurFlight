document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('itinerary-container');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const timeBtns = document.querySelectorAll('.time-btn');
    
    let hiddenItems = JSON.parse(localStorage.getItem('hiddenItineraryItems')) || [];
    
    // Track both filter states
    let currentCategory = 'all';
    let currentTime = 'all';

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

    itineraryData.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));

    function renderCards() {
        container.innerHTML = ''; 

        // Establish our time boundaries based on the current moment
        const now = new Date();
        
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        
        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        const tomorrowEnd = new Date(todayEnd);
        tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
        
        const day3End = new Date(todayEnd);
        day3End.setDate(day3End.getDate() + 3);

        itineraryData.forEach((item) => {
            const itemDateTime = new Date(`${item.date} ${item.time}`);
            const itemId = item.reference + item.date;
            const isHidden = hiddenItems.includes(itemId);
            const isPast = itemDateTime < now;

            // 1. Check Category Match
            if (currentCategory === 'hidden') {
                if (!isHidden) return; 
            } else {
                if (isHidden) return; 
                if (currentCategory !== 'all' && item.type !== currentCategory) return; 
            }

            // 2. Check Time Match
            if (currentTime !== 'all') {
                let timeMatch = false;
                if (currentTime === 'day0') {
                    timeMatch = (itemDateTime >= todayStart && itemDateTime <= todayEnd);
                } else if (currentTime === 'day1') {
                    timeMatch = (itemDateTime >= tomorrowStart && itemDateTime <= tomorrowEnd);
                } else if (currentTime === 'day3') {
                    timeMatch = (itemDateTime >= now && itemDateTime <= day3End);
                }
                
                if (!timeMatch) return; // Skip if it doesn't fit the time filter
            }

            // Build the card
            const card = document.createElement('div');
            let classNames = ['flight-card'];
            if (isPast) classNames.push('past');
            card.className = classNames.join(' ');

            card.addEventListener('click', (e) => {
                if (e.target.closest('.action-btn')) return;
                card.classList.toggle('expanded');
            });

            let hideBtnHTML = '';
            if (isPast) {
                if (isHidden) {
                    hideBtnHTML = `<button class="action-btn toggle-hide-btn" data-id="${itemId}">👁️ Unhide</button>`;
                } else {
                    hideBtnHTML = `<button class="action-btn toggle-hide-btn" data-id="${itemId}">👻 Hide</button>`;
                }
            }

            // NEW: Smart Weather Location Logic
            // Use destination for travel, but current city for hotels, cars, and excursions
            let weatherLocation = item.startPoint;
            if (item.type === 'flight' || item.type === 'train') {
                weatherLocation = item.endPoint; 
            }
            
            // Universal Weather Button
            let weatherBtnHTML = `<a href="https://www.google.com/search?q=current+weather+${encodeURIComponent(weatherLocation)}" target="_blank" class="action-btn weather-btn">⛅ Weather</a>`;

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

    // Handle Category Filter Clicks
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            renderCards();
        });
    });

    // Handle Time Filter Clicks
    timeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            timeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentTime = e.target.dataset.time;
            renderCards();
        });
    });

    // Handle Hide/Unhide Clicks
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('toggle-hide-btn')) {
            const itemId = e.target.getAttribute('data-id');
            if (hiddenItems.includes(itemId)) {
                hiddenItems = hiddenItems.filter(id => id !== itemId);
            } else {
                hiddenItems.push(itemId);
            }
            localStorage.setItem('hiddenItineraryItems', JSON.stringify(hiddenItems));
            renderCards();
        }
    });

    renderCards();
});
