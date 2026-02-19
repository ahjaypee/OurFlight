document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('flights-container');
    const CACHE_KEY = 'cachedFlightItinerary';
    
    let cachedData = JSON.parse(localStorage.getItem(CACHE_KEY)) || [];

    flightsData.forEach((flight, index) => {
        let isChanged = false;
        
        // Check for modified flight details
        if (cachedData.length > 0 && cachedData[index]) {
            const oldFlight = cachedData[index];
            if (oldFlight.time !== flight.time || oldFlight.date !== flight.date || oldFlight.flightNumber !== flight.flightNumber) {
                isChanged = true;
            }
        }

        // --- NEW: Check if the flight is in the past ---
        const flightDateTime = new Date(`${flight.date} ${flight.time}`);
        const now = new Date();
        const isPast = flightDateTime < now;

        // Create the card container
        const card = document.createElement('div');
        
        // Build the CSS class list dynamically
        let classNames = ['flight-card'];
        if (isChanged) classNames.push('changed');
        if (isPast) classNames.push('past');
        card.className = classNames.join(' ');

        card.innerHTML = `
            ${isChanged ? '<div class="changed-badge">UPDATED</div>' : ''}
            <div class="route">
                <span>${flight.departure}</span>
                <span>✈️</span>
                <span>${flight.arrival}</span>
            </div>
            <div class="details">
                <div class="datetime">
                    <span class="date">${flight.date}</span>
                    <span class="time">${flight.time}</span>
                </div>
                <div class="flight-number">${flight.flightNumber}</div>
            </div>
            <div class="airline">${flight.airline}</div>
            
            <div class="button-group">
                <a href="${flight.searchQuery}" target="_blank" class="action-btn google-btn">Google Status</a>
                <a href="${flight.flightAwareUrl}" target="_blank" class="action-btn flightaware-btn">FlightAware</a>
            </div>
        `;

        container.appendChild(card);
    });

    localStorage.setItem(CACHE_KEY, JSON.stringify(flightsData));
});
