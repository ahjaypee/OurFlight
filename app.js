document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('flights-container');
    const CACHE_KEY = 'cachedFlightItinerary';
    
    let cachedData = JSON.parse(localStorage.getItem(CACHE_KEY)) || [];

    flightsData.forEach((flight, index) => {
        let isChanged = false;
        
        if (cachedData.length > 0 && cachedData[index]) {
            const oldFlight = cachedData[index];
            if (oldFlight.time !== flight.time || oldFlight.date !== flight.date || oldFlight.flightNumber !== flight.flightNumber) {
                isChanged = true;
            }
        }

        const card = document.createElement('div');
        card.className = `flight-card ${isChanged ? 'changed' : ''}`;

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