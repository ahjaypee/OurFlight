document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('itinerary-container');
    const countdownBanner = document.getElementById('countdown-banner');
    const tripContainer = document.getElementById('trip-filter-container');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const timeBtns = document.querySelectorAll('.time-btn');
    
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQve_ZOhcMNg5ITqIvTuIHH_Pcy6pRRoyGw691MvqTVilIC7FzFHGxycf-svHjbItJBp--BTG37Xlui/pub?output=csv';
    
    let hiddenItems = JSON.parse(localStorage.getItem('hiddenItineraryItems')) || [];
    
    let currentTrip = 'all';
    let currentCategory = 'all';
    let currentTime = 'all';
    let itineraryData = []; 

    const typeIcons = { flight: '✈️', train: '🚆', car: '🚗', hotel: '🏨', excursion: '🍳' };

    async function initApp() {
        try {
            setupTimeButtons(); 
            
            const response = await fetch(sheetUrl);
            const csvText = await response.text();
            
            itineraryData = parseCSV(csvText);
            itineraryData.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
            
            buildTripFilters(); 
            renderCards();
            renderCountdown(); 
            setInterval(renderCountdown, 60000); 
        } catch (error) {
            container.innerHTML = '<p style="text-align:center; padding: 30px; color: #ffba08;">⚠️ Could not load data from Google Sheets.</p>';
        }
    }

    function setupTimeButtons() {
        const now = new Date();
        const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const today = new Date(now);
        const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date(now); dayAfter.setDate(dayAfter.getDate() + 2);

        document.querySelector('.time-btn[data-time="today"]').textContent = `Today (${formatDate(today)})`;
        document.querySelector('.time-btn[data-time="tomorrow"]').textContent = `Tomorrow (${formatDate(tomorrow)})`;
        document.querySelector('.time-btn[data-time="dayafter"]').textContent = `Day After (${formatDate(dayAfter)})`;
    }

    function parseCSV(str) {
        const rows = [];
        let row = [], curr = '', inQuotes = false;
        
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) { row.push(curr.trim()); curr = ''; }
            else if (char === '\n' && !inQuotes) { row.push(curr.trim()); rows.push(row); row = []; curr = ''; }
            else if (char !== '\r') curr += char;
        }
        row.push(curr.trim()); rows.push(row);
        
        const cleanRows = rows.filter(r => r.join('').trim() !== '');
        if (cleanRows.length < 2) return []; 
        
        const headers = cleanRows[0];
        const data = [];
        
        for (let i = 1; i < cleanRows.length; i++) {
            let obj = {};
            headers.forEach((header, index) => { obj[header] = cleanRows[i][index] || ''; });
            data.push(obj);
        }
        return data;
    }

    function buildTripFilters() {
        const uniqueTrips = [...new Set(itineraryData.map(item => item.trip).filter(trip => trip && trip.trim() !== ''))];
        
        if (uniqueTrips.length === 0) {
            tripContainer.style.display = 'none';
            return;
        }

        tripContainer.style.display = 'flex';
        tripContainer.innerHTML = '';

        uniqueTrips.forEach(trip => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn trip-btn';
            btn.setAttribute('data-trip', trip);
            btn.textContent = trip;
            
            btn.addEventListener('click', () => {
                const clickedTrip = btn.getAttribute('data-trip');
                
                if (currentTrip === clickedTrip) {
                    btn.classList.remove('active');
                    currentTrip = 'all';
                } else {
                    document.querySelectorAll('.trip-btn').forEach(b => b.classList.remove('active')); 
                    btn.classList.add('active'); 
                    currentTrip = clickedTrip; 
                }
                
                renderCards(); 
                renderCountdown(); 
            });

            tripContainer.appendChild(btn);
        });
    }

    function getVisibleItems() {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        const tomorrowStart = new Date(todayStart); tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        const tomorrowEnd = new Date(todayEnd); tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
        const dayAfterStart = new Date(todayStart); dayAfterStart.setDate(dayAfterStart.getDate() + 2);
        const dayAfterEnd = new Date(todayEnd); dayAfterEnd.setDate(dayAfterEnd.getDate() + 2);

        return itineraryData.filter((item) => {
            const itemDateTime = new Date(`${item.date} ${item.time}`);
            const itemId = item.reference + item.date;
            const isHidden = hiddenItems.includes(itemId);

            if (currentTrip !== 'all' && item.trip !== currentTrip) return false;

            if (currentCategory === 'hidden') {
                if (!isHidden) return false; 
            } else {
                if (isHidden) return false; 
                if (currentCategory !== 'all' && item.type !== currentCategory) return false; 
            }

            if (currentTime !== 'all') {
                let timeMatch = false;
                if (currentTime === 'today') timeMatch = (itemDateTime >= todayStart && itemDateTime <= todayEnd);
                else if (currentTime === 'tomorrow') timeMatch = (itemDateTime >= tomorrowStart && itemDateTime <= tomorrowEnd);
                else if (currentTime === 'dayafter') timeMatch = (itemDateTime >= dayAfterStart && itemDateTime <= dayAfterEnd);
                if (!timeMatch) return false;
            }

            return true;
        });
    }

    function renderCountdown() {
        if (itineraryData.length === 0) {
            countdownBanner.style.display = 'none';
            return;
        }

        const visibleItems = getVisibleItems();

        if (visibleItems.length === 0) {
            countdownBanner.style.display = 'none';
            return;
        }

        countdownBanner.style.display = 'block';

        const now = new Date();
        const nextEvent = visibleItems.find(item => {
            const itemDate = new Date(`${item.date} ${item.time}`);
            return itemDate > now;
        });

        if (!nextEvent) {
            countdownBanner.innerHTML = `
                <div class="countdown-title">View Status</div>
                <div class="countdown-timer">🏁 Past Events</div>
            `;
            return;
        }

        const eventDate = new Date(`${nextEvent.date} ${nextEvent.time}`);
        const diffMs = eventDate - now;
        
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        let countdownText = '';
        if (days > 0) countdownText += `${days}d `;
        if (hours > 0 || days > 0) countdownText += `${hours}h `;
        countdownText += `${minutes}m`;

        countdownBanner.innerHTML = `
            <div class="countdown-title">Next Up: ${nextEvent.title}</div>
            <div class="countdown-timer">⏳ ${countdownText}</div>
        `;
    }

    function renderCards() {
        container.innerHTML = ''; 

        if (itineraryData.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 30px; color: #888;">⚠️ No trips found. Is your Google Sheet populated and published?</p>';
            return;
        }

        const visibleItems = getVisibleItems();

        if (visibleItems.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 30px; color: #888;">No events match your current filters.</p>';
            return;
        }

        const now = new Date();

        visibleItems.forEach((item) => {
            const itemDateTime = new Date(`${item.date} ${item.time}`);
            const itemId = item.reference + item.date;
            const isHidden = hiddenItems.includes(itemId);
            const isPast = itemDateTime < now;

            const card = document.createElement('div');
            let classNames = ['flight-card'];
            if (isPast) classNames.push('past');
            card.className = classNames.join(' ');

            card.addEventListener('click', (e) => {
                if (e.target.closest('.action-btn') || e.target.closest('.small-hide-btn')) return;
                card.classList.toggle('expanded');
            });

            let hideBtnHTML = '';
            if (isPast) {
                hideBtnHTML = isHidden 
                    ? `<button class="small-hide-btn toggle-hide-btn" data-id="${itemId}">Unhide</button>` 
                    : `<button class="small-hide-btn toggle-hide-btn" data-id="${itemId}">Hide</button>`;
            }

            let weatherLocation = (item.type === 'flight' || item.type === 'train') ? item.endPoint : item.startPoint;
            let weatherBtnHTML = `<a href="https://www.google.com/search?q=current+weather+${encodeURIComponent(weatherLocation)}" target="_blank" class="action-btn weather-btn">Weather</a>`;

            let hrOffsetBadge = '';
            if (item.hrOffset) {
                let badgeBg = '#e2e8f0'; 
                let badgeText = '#475569';
                
                if (item.hrOffset.includes('+')) {
                    badgeBg = '#dbeafe'; 
                    badgeText = '#1e40af';
                } else if (item.hrOffset.includes('-')) {
                    badgeBg = '#f3e8ff'; 
                    badgeText = '#6b21a8';
                }
                
                hrOffsetBadge = ` <span style="color:${badgeText}; font-weight:bold; font-size:0.85em; background-color:${badgeBg}; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">⏱️ ${item.hrOffset}</span>`;
            }

            const timeZoneBadge = item.timeZone ? ` <span style="font-size:0.85em; color:#888;">${item.timeZone}</span>` : '';
            const nextDayBadge = item.dayOffset ? ` <span style="color:#f77f00; font-weight:bold; font-size:0.85em; margin-left: 4px;">${item.dayOffset} Day</span>` : '';

            card.innerHTML = `
                <div class="card-summary">
                    <div class="summary-icon">${typeIcons[item.type] || '📍'}</div>
                    <div class="summary-route">
                        <div class="route-text">${item.startPoint} ➔ ${item.endPoint}</div>
                        <div class="route-date">${item.date} • ${item.time}${timeZoneBadge}${hrOffsetBadge}${nextDayBadge}</div>
                    </div>
                    <div class="expand-icon">▼</div>
                </div>

                <div class="card-details">
                    <div class="details-header" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <div class="flight-number">${item.reference}</div>
                        ${item.pnr ? `<div class="pnr-badge">PNR: ${item.pnr}</div>` : ''}
                        ${hideBtnHTML}
                    </div>
                    <div class="airline">${item.title}</div>
                    
                    <div class="button-group">
                        ${item.link1Url ? `<a href="${item.link1Url}" target="_blank" class="action-btn primary-btn">${item.link1Text}</a>` : ''}
                        ${item.link2Url ? `<a href="${item.link2Url}" target="_blank" class="action-btn secondary-btn">${item.link2Text}</a>` : ''}
                        ${weatherBtnHTML}
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    }

    categoryBtns.forEach(btn => { 
        btn.addEventListener('click', () => { 
            const clickedCategory = btn.getAttribute('data-category');
            if (currentCategory === clickedCategory) {
                btn.classList.remove('active');
                currentCategory = 'all';
            } else {
                categoryBtns.forEach(b => b.classList.remove('active')); 
                btn.classList.add('active'); 
                currentCategory = clickedCategory; 
            }
            renderCards(); 
            renderCountdown(); 
        }); 
    });

    timeBtns.forEach(btn => { 
        btn.addEventListener('click', () => { 
            const clickedTime = btn.getAttribute('data-time');
            if (currentTime === clickedTime) {
                btn.classList.remove('active');
                currentTime = 'all';
            } else {
                timeBtns.forEach(b => b.classList.remove('active')); 
                btn.classList.add('active'); 
                currentTime = clickedTime; 
            }
            renderCards(); 
            renderCountdown(); 
        }); 
    });
    
    container.addEventListener('click', (e) => { 
        if (e.target.classList.contains('toggle-hide-btn')) { 
            const itemId = e.target.getAttribute('data-id'); 
            if (hiddenItems.includes(itemId)) hiddenItems = hiddenItems.filter(id => id !== itemId); 
            else hiddenItems.push(itemId); 
            localStorage.setItem('hiddenItineraryItems', JSON.stringify(hiddenItems)); 
            renderCards(); 
            renderCountdown(); 
        } 
    });

    initApp();
});
