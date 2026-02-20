document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('itinerary-container');
    const countdownBanner = document.getElementById('countdown-banner');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const timeBtns = document.querySelectorAll('.time-btn');
    
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQve_ZOhcMNg5ITqIvTuIHH_Pcy6pRRoyGw691MvqTVilIC7FzFHGxycf-svHjbItJBp--BTG37Xlui/pub?output=csv';
    
    let hiddenItems = JSON.parse(localStorage.getItem('hiddenItineraryItems')) || [];
    let addedCalendarItems = JSON.parse(localStorage.getItem('addedCalendarItems')) || [];
    
    let currentCategory = 'all';
    let currentTime = 'all';
    let itineraryData = []; 

    const typeIcons = { flight: '✈️', train: '🚆', car: '🚗', hotel: '🏨', excursion: '🍳' };

    async function initApp() {
        try {
            const response = await fetch(sheetUrl);
            const csvText = await response.text();
            
            itineraryData = parseCSV(csvText);
            itineraryData.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
            
            renderCards();
            renderCountdown(); 
            setInterval(renderCountdown, 60000); 
        } catch (error) {
            container.innerHTML = '<p style="text-align:center; padding: 30px; color: #ffba08;">⚠️ Could not load data from Google Sheets.</p>';
        }
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
        if (cleanRows.length < 2) return []; // Safety check for empty sheets
        
        const headers = cleanRows[0];
        const data = [];
        
        for (let i = 1; i < cleanRows.length; i++) {
            let obj = {};
            headers.forEach((header, index) => { obj[header] = cleanRows[i][index] || ''; });
            data.push(obj);
        }
        return data;
    }

    function generateCalendarLink(item) {
        const itemDate = new Date(`${item.date} ${item.time}`);
        const pad = (n) => n < 10 ? '0' + n : n;
        const startStr = `${itemDate.getFullYear()}${pad(itemDate.getMonth()+1)}${pad(itemDate.getDate())}T${pad(itemDate.getHours())}${pad(itemDate.getMinutes())}00`;
        const endDate = new Date(itemDate.getTime() + 2 * 60 * 60 * 1000);
        const endStr = `${endDate.getFullYear()}${pad(endDate.getMonth()+1)}${pad(endDate.getDate())}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`;

        const title = encodeURIComponent(`${typeIcons[item.type] || ''} ${item.title} (${item.reference})`);
        const details = encodeURIComponent(`Booking Ref/PNR: ${item.pnr || item.reference}\nRoute: ${item.startPoint} to ${item.endPoint}`);
        const location = encodeURIComponent(item.startPoint);

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
    }

    function renderCountdown() {
        if (itineraryData.length === 0) {
            countdownBanner.style.display = 'none';
            return;
        }

        const now = new Date();
        const nextEvent = itineraryData.find(item => {
            const itemDate = new Date(`${item.date} ${item.time}`);
            const itemId = item.reference + item.date;
            return itemDate > now && !hiddenItems.includes(itemId);
        });

        if (!nextEvent) {
            countdownBanner.style.display = 'none';
            return;
        }

        countdownBanner.style.display = 'block';
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

        // NEW: Tell the user if the spreadsheet is empty!
        if (itineraryData.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 30px; color: #888;">⚠️ No trips found. Is your Google Sheet populated and published?</p>';
            return;
        }

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        const tomorrowStart = new Date(todayStart); tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        const tomorrowEnd = new Date(todayEnd); tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
        const day3End = new Date(todayEnd); day3End.setDate(day3End.getDate() + 3);

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
                if (currentTime === 'day0') timeMatch = (itemDateTime >= todayStart && itemDateTime <= todayEnd);
                else if (currentTime === 'day1') timeMatch = (itemDateTime >= tomorrowStart && itemDateTime <= tomorrowEnd);
                else if (currentTime === 'day3') timeMatch = (itemDateTime >= now && itemDateTime <= day3End);
                if (!timeMatch) return;
            }

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
                    ? `<button class="small-hide-btn toggle-hide-btn" data-id="${itemId}">👁️ Unhide</button>` 
                    : `<button class="small-hide-btn toggle-hide-btn" data-id="${itemId}">👻 Hide</button>`;
            }

            let weatherLocation = (item.type === 'flight' || item.type === 'train') ? item.endPoint : item.startPoint;
            let weatherBtnHTML = `<a href="https://www.google.com/search?q=current+weather+${encodeURIComponent(weatherLocation)}" target="_blank" class="action-btn weather-btn">⛅ Weather</a>`;

            const calLink = generateCalendarLink(item);
            let calBtnHTML = '';
            if (addedCalendarItems.includes(itemId)) {
                calBtnHTML = `<a href="${calLink}" target="_blank" class="action-btn calendar-added-btn">✅ Added</a>`;
            } else {
                calBtnHTML = `<a href="${calLink}" target="_blank" class="action-btn calendar-btn track-calendar-btn" data-id="${itemId}">📅 Calendar</a>`;
            }

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
                        <a href="${item.link1Url}" target="_blank" class="action-btn primary-btn">${item.link1Text}</a>
                        <a href="${item.link2Url}" target="_blank" class="action-btn secondary-btn">${item.link2Text}</a>
                        ${weatherBtnHTML}
                        ${calBtnHTML}
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    }

    categoryBtns.forEach(btn => { btn.addEventListener('click', (e) => { categoryBtns.forEach(b => b.classList.remove('active')); e.target.classList.add('active'); currentCategory = e.target.dataset.category; renderCards(); }); });
    timeBtns.forEach(btn => { btn.addEventListener('click', (e) => { timeBtns.forEach(b => b.classList.remove('active')); e.target.classList.add('active'); currentTime = e.target.dataset.time; renderCards(); }); });
    
    container.addEventListener('click', (e) => { 
        if (e.target.classList.contains('toggle-hide-btn')) { 
            const itemId = e.target.getAttribute('data-id'); 
            if (hiddenItems.includes(itemId)) hiddenItems = hiddenItems.filter(id => id !== itemId); 
            else hiddenItems.push(itemId); 
            localStorage.setItem('hiddenItineraryItems', JSON.stringify(hiddenItems)); 
            renderCards(); 
            renderCountdown(); 
        } 
        
        const trackCalBtn = e.target.closest('.track-calendar-btn');
        if (trackCalBtn) {
            const itemId = trackCalBtn.getAttribute('data-id');
            if (!addedCalendarItems.includes(itemId)) {
                addedCalendarItems.push(itemId);
                localStorage.setItem('addedCalendarItems', JSON.stringify(addedCalendarItems));
                
                trackCalBtn.classList.remove('calendar-btn', 'track-calendar-btn');
                trackCalBtn.classList.add('calendar-added-btn');
                trackCalBtn.innerHTML = '✅ Added';
            }
        }
    });

    initApp();
});
