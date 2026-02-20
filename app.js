document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('itinerary-container');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const timeBtns = document.querySelectorAll('.time-btn');
    
    // This is the live link to your Google Sheet!
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQve_ZOhcMNg5ITqIvTuIHH_Pcy6pRRoyGw691MvqTVilIC7FzFHGxycf-svHjbItJBp--BTG37Xlui/pub?output=csv';
    
    let hiddenItems = JSON.parse(localStorage.getItem('hiddenItineraryItems')) || [];
    let currentCategory = 'all';
    let currentTime = 'all';
    let itineraryData = []; // Will be populated from Google Sheets

    const typeIcons = {
        flight: '✈️',
        train: '🚆',
        car: '🚗',
        hotel: '🏨',
        excursion: '🍳'
    };

    // 1. Fetch Data from Google Sheets
    async function initApp() {
        try {
            const response = await fetch(sheetUrl);
            const csvText = await response.text();
            
            itineraryData = parseCSV(csvText);
            
            // Sort chronologically
            itineraryData.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
            
            renderCards();
        } catch (error) {
            container.innerHTML = '<p style="text-align:center; padding: 30px; color: #ffba08;">⚠️ Could not load data from Google Sheets. Check your internet connection.</p>';
        }
    }

    // 2. Custom CSV Parser
    function parseCSV(str) {
        const rows = [];
        let row = [];
        let curr = '';
        let inQuotes = false;
        
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                row.push(curr.trim());
                curr = '';
            } else if (char === '\n' && !inQuotes) {
                row.push(curr.trim());
                rows.push(row);
                row = [];
                curr = '';
            } else if (char !== '\r') {
                curr += char;
            }
        }
        row.push(curr.trim());
        rows.push(row);
        
        const cleanRows = rows.filter(r => r.join('').trim() !== '');
        const headers = cleanRows[0];
        const data = [];
        
        for (let i = 1; i < cleanRows.length; i++) {
            let obj = {};
            headers.forEach((header, index) => {
                obj[header] = cleanRows[i][index] || '';
            });
            data.push(obj);
        }
        return data;
    }

    // 3. Render the Cards
    function renderCards() {
        container.innerHTML = ''; 

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

            if (currentCategory === 'hidden') {
                if (!isHidden) return; 
            } else {
                if (isHidden) return; 
                if (currentCategory !== 'all' && item.type !== currentCategory) return; 
            }

            if (currentTime !== 'all') {
                let timeMatch = false;
                if (currentTime === 'day0') {
                    timeMatch = (itemDateTime >= todayStart && itemDateTime <= todayEnd);
                } else if (currentTime === 'day1') {
                    timeMatch = (itemDateTime >= tomorrowStart && itemDateTime <= tomorrowEnd);
                } else if (currentTime === 'day3') {
                    timeMatch = (itemDateTime >= now && itemDateTime <= day3End);
                }
                if (!timeMatch) return;
            }

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

            let weatherLocation = item.startPoint;
            if (item.type === 'flight' || item.type === 'train') {
                weatherLocation = item.endPoint; 
            }
            let weatherBtnHTML = `<a href="https://www.google.com/search?q=current+weather+${encodeURIComponent(weatherLocation)}" target="_blank" class="action-btn weather-btn">⛅ Weather</a>`;

            // Setup new visual badges
            const timeZoneBadge = item.timeZone ? ` <span style="font-size:0.85em; color:#888;">${item.timeZone}</span>` : '';
            const nextDayBadge = item.dayOffset ? ` <span style="color:#f77f00; font-weight:bold; font-size:0.85em;">${item.dayOffset} Day</span>` : '';

            card.innerHTML = `
                <div class="card-summary">
                    <div class="summary-icon">${typeIcons[item.type] || '📍'}</div>
                    <div class="summary-route">
                        <div class="route-text">${item.startPoint} ➔ ${item.endPoint}</div>
                        <div class="route-date">${item.date} • ${item.time}${timeZoneBadge}${nextDayBadge}</div>
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

    // Event Listeners
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            renderCards();
        });
    });

    timeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            timeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentTime = e.target.dataset.time;
            renderCards();
        });
    });

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

    // Boot up the app
    initApp();
});
