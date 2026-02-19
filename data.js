const itineraryData = [
  // --- ASIA TRIP ---
  {
    type: "flight",
    title: "Qatar Airways",
    reference: "QR 710",
    startPoint: "Dulles (IAD)",
    endPoint: "Doha (DOH)",
    date: "Mar 4, 2026",
    time: "10:40 AM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=QR+710+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/QR710"
  },
  {
    type: "flight",
    title: "Qatar Airways",
    reference: "QR 846",
    startPoint: "Doha (DOH)",
    endPoint: "Phuket (HKT)",
    date: "Mar 5, 2026",
    time: "8:25 AM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=QR+846+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/QR846"
  },
  {
    type: "flight",
    title: "Thai Airways",
    reference: "TG 204",
    startPoint: "Phuket (HKT)",
    endPoint: "Bangkok (BKK)",
    date: "Mar 11, 2026",
    time: "10:25 AM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=TG+204+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/TG204"
  },
  {
    type: "flight",
    title: "Thai Airways",
    reference: "TG 407",
    startPoint: "Bangkok (BKK)",
    endPoint: "Singapore (SIN)",
    date: "Mar 19, 2026",
    time: "2:55 PM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=TG+407+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/TG407"
  },
  {
    type: "flight",
    title: "Scoot",
    reference: "TR 324",
    startPoint: "Singapore (SIN)",
    endPoint: "Phu Quoc (PQC)",
    date: "Mar 23, 2026",
    time: "4:30 PM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=TR+324+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/TR324"
  },
  {
    type: "flight",
    title: "Vietnam Airlines",
    reference: "VN 6104",
    startPoint: "Phu Quoc (PQC)",
    endPoint: "Ho Chi Minh City (SGN)",
    date: "Mar 26, 2026",
    time: "11:30 AM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=VN+6104+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/VN6104"
  },
  {
    type: "flight",
    title: "Vietnam Airlines",
    reference: "VN 126",
    startPoint: "Ho Chi Minh City (SGN)",
    endPoint: "Da Nang (DAD)",
    date: "Mar 29, 2026",
    time: "11:00 AM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=VN+126+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/VN126"
  },
  {
    type: "flight",
    title: "Vietnam Airlines",
    reference: "VN 1540",
    startPoint: "Hue (HUI)",
    endPoint: "Hanoi (HAN)",
    date: "Apr 3, 2026",
    time: "7:35 AM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=VN+1540+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/VN1540"
  },
  {
    type: "flight",
    title: "Qatar Airways",
    reference: "QR 983",
    startPoint: "Hanoi (HAN)",
    endPoint: "Doha (DOH)",
    date: "Apr 6, 2026",
    time: "8:45 AM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=QR+983+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/QR983"
  },
  {
    type: "flight",
    title: "Qatar Airways",
    reference: "QR 709",
    startPoint: "Doha (DOH)",
    endPoint: "Dulles (IAD)",
    date: "Apr 10, 2026",
    time: "1:05 AM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=QR+709+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/QR709"
  },

  // --- SAS EUROPE TRIP ---
  {
    type: "flight",
    title: "SAS",
    reference: "SK 926",
    startPoint: "Dulles (IAD)",
    endPoint: "Copenhagen (CPH)",
    date: "May 13, 2026",
    time: "8:20 PM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=SK+926+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/SAS926"
  },
  {
    type: "flight",
    title: "SAS",
    reference: "SK 667",
    startPoint: "Copenhagen (CPH)",
    endPoint: "Stuttgart (STR)",
    date: "May 14, 2026",
    time: "7:05 AM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=SK+667+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/SAS667"
  },
  {
    type: "flight",
    title: "SAS",
    reference: "SK 2692",
    startPoint: "Venice (VCE)",
    endPoint: "Copenhagen (CPH)",
    date: "Jun 1, 2026",
    time: "5:00 AM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=SK+2692+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/SAS2692"
  },
  {
    type: "flight",
    title: "SAS",
    reference: "SK 925",
    startPoint: "Copenhagen (CPH)",
    endPoint: "Dulles (IAD)",
    date: "Jun 1, 2026",
    time: "8:15 AM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=SK+925+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/SAS925"
  },

  // --- UK / GREECE TRIP ---
 {
    type: "flight",
    title: "American Airlines (Kate)",
    reference: "AA 728",
    pnr: "HBHMVH", // <--- Here is the new PNR line!
    startPoint: "Philadelphia (PHL)",
    endPoint: "London (LHR)",
    date: "Aug 26, 2026",
    time: "10:20 PM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=AA+728+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/AA728"
  },
  {
    type: "flight",
    title: "American Airlines (Robert)",
    reference: "AA 6911",
    pnr: "[Update]", // You can use placeholders until you find the code
    startPoint: "Philadelphia (PHL)",
    endPoint: "London (LHR)",
    date: "Sep 1, 2026",
    time: "6:45 PM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=AA+6911+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/AA6911"
  },
  // ... (skipping down to the return flight)
  {
    type: "flight",
    title: "American Airlines",
    reference: "AA 759",
    pnr: "HBHMVH", // The return flight shares the same code
    startPoint: "Athens (ATH)",
    endPoint: "Philadelphia (PHL)",
    date: "Sep 28, 2026",
    time: "1:00 PM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=AA+759+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/AA759"
  },
  {
    type: "excursion",
    title: "Greek Cooking Session",
    reference: "Confirmed",
    startPoint: "Athens Center",
    endPoint: "Local Kitchen",
    date: "Sep 15, 2026",
    time: "4:00 PM",
    link1Text: "Directions",
    link1Url: "https://maps.google.com",
    link2Text: "Class Details",
    link2Url: "#"
  },
  {
    type: "flight",
    title: "American Airlines",
    reference: "AA 759",
    startPoint: "Athens (ATH)",
    endPoint: "Philadelphia (PHL)",
    date: "Sep 28, 2026",
    time: "1:00 PM",
    link1Text: "Google Status",
    link1Url: "https://www.google.com/search?q=AA+759+flight+status",
    link2Text: "FlightAware",
    link2Url: "https://flightaware.com/live/flight/AA759"
  },
  // --- EUROPEAN RAIL JOURNEY ---
  {
    type: "train",
    title: "Deutsche Bahn / SBB",
    reference: "ICE / EC [Update]",
    startPoint: "Stuttgart Hbf",
    endPoint: "Lucerne",
    date: "May 18, 2026", // Update with your actual travel date
    time: "10:00 AM",     // Update with your actual departure time
    link1Text: "DB Live Status",
    link1Url: "https://int.bahn.de/en/",
    link2Text: "SBB Timetable",
    link2Url: "https://www.sbb.ch/en"
  },
  {
    type: "train",
    title: "SBB (Swiss Federal Railways)",
    reference: "IC [Update]",
    startPoint: "Lucerne",
    endPoint: "Lugano",
    date: "May 22, 2026", // Update with your actual travel date
    time: "11:00 AM",     // Update with your actual departure time
    link1Text: "SBB Live Status",
    link1Url: "https://www.sbb.ch/en",
    link2Text: "Station Map",
    link2Url: "https://www.sbb.ch/en/travel-information/stations.html"
  },
  {
    type: "train",
    title: "SBB / Trenitalia",
    reference: "EC [Update]",
    startPoint: "Lugano",
    endPoint: "Venice S. Lucia",
    date: "May 26, 2026", // Update with your actual travel date
    time: "09:30 AM",     // Update with your actual departure time
    link1Text: "Trenitalia Status",
    link1Url: "https://www.trenitalia.com/en.html",
    link2Text: "SBB Timetable",
    link2Url: "https://www.sbb.ch/en"
  },
  // --- SOUTHEAST ASIA HOTELS (BLANK CANVAS) ---
  {
    type: "hotel",
    title: "Outrigger Khao Lak Beach Resort",
    reference: "Booking [Update]",
    startPoint: "Khao Lak, Thailand",
    endPoint: "Check-out: Mar 11",
    date: "Mar 5, 2026",
    time: "3:00 PM",
    link1Text: "Hotel Info",
    link1Url: "https://www.google.com/search?q=Outrigger+Khao+Lak+Beach+Resort",
    link2Text: "Directions",
    link2Url: "https://www.google.com/maps/search/Outrigger+Khao+Lak+Beach+Resort"
  },
  {
    type: "hotel",
    title: "Royal River Kwai Resort",
    reference: "Booking [Update]",
    startPoint: "Kanchanaburi, Thailand",
    endPoint: "Check-out: Mar 14",
    date: "Mar 11, 2026",
    time: "3:00 PM",
    link1Text: "Hotel Info",
    link1Url: "https://www.google.com/search?q=Royal+River+Kwai+Resort",
    link2Text: "Directions",
    link2Url: "https://www.google.com/maps/search/Royal+River+Kwai+Resort"
  },
  {
    type: "hotel",
    title: "Hotel Riva Arun Bangkok",
    reference: "Booking [Update]",
    startPoint: "Bangkok, Thailand",
    endPoint: "Check-out: Mar 19",
    date: "Mar 14, 2026",
    time: "3:00 PM",
    link1Text: "Hotel Info",
    link1Url: "https://www.google.com/search?q=Hotel+Riva+Arun+Bangkok",
    link2Text: "Directions",
    link2Url: "https://www.google.com/maps/search/Hotel+Riva+Arun+Bangkok"
  },
  {
    type: "hotel",
    title: "The Clan Hotel",
    reference: "Booking [Update]",
    startPoint: "Singapore",
    endPoint: "Check-out: Mar 23",
    date: "Mar 19, 2026",
    time: "3:00 PM",
    link1Text: "Hotel Info",
    link1Url: "https://www.google.com/search?q=The+Clan+Hotel+Singapore",
    link2Text: "Directions",
    link2Url: "https://www.google.com/maps/search/The+Clan+Hotel+Singapore"
  },
  {
    type: "hotel",
    title: "Salinda Resort Phu Quoc Island",
    reference: "Booking [Update]",
    startPoint: "Phu Quoc, Vietnam",
    endPoint: "Check-out: Mar 26",
    date: "Mar 23, 2026",
    time: "3:00 PM",
    link1Text: "Hotel Info",
    link1Url: "https://www.google.com/search?q=Salinda+Resort+Phu+Quoc+Island",
    link2Text: "Directions",
    link2Url: "https://www.google.com/maps/search/Salinda+Resort+Phu+Quoc+Island"
  },
  {
    type: "hotel",
    title: "Hotel des Arts Saigon",
    reference: "Booking [Update]",
    startPoint: "Ho Chi Minh City, Vietnam",
    endPoint: "Check-out: Mar 29",
    date: "Mar 26, 2026",
    time: "3:00 PM",
    link1Text: "Hotel Info",
    link1Url: "https://www.google.com/search?q=Hotel+des+Arts+Saigon",
    link2Text: "Directions",
    link2Url: "https://www.google.com/maps/search/Hotel+des+Arts+Saigon"
  },
  {
    type: "hotel",
    title: "La Siesta Hoi An",
    reference: "Booking [Update]",
    startPoint: "Hoi An, Vietnam",
    endPoint: "Check-out: Apr 1",
    date: "Mar 29, 2026",
    time: "3:00 PM",
    link1Text: "Hotel Info",
    link1Url: "https://www.google.com/search?q=La+Siesta+Hoi+An",
    link2Text: "Directions",
    link2Url: "https://www.google.com/maps/search/La+Siesta+Hoi+An"
  },
  {
    type: "hotel",
    title: "Silk Path Grand Hue Hotel",
    reference: "Booking [Update]",
    startPoint: "Hue, Vietnam",
    endPoint: "Check-out: Apr 3",
    date: "Apr 1, 2026",
    time: "3:00 PM",
    link1Text: "Hotel Info",
    link1Url: "https://www.google.com/search?q=Silk+Path+Grand+Hue+Hotel",
    link2Text: "Directions",
    link2Url: "https://www.google.com/maps/search/Silk+Path+Grand+Hue+Hotel"
  },
  {
    type: "hotel",
    title: "La Siesta Premium Hang Be",
    reference: "Booking [Update]",
    startPoint: "Hanoi, Vietnam",
    endPoint: "Check-out: Apr 4",
    date: "Apr 3, 2026",
    time: "3:00 PM",
    link1Text: "Hotel Info",
    link1Url: "https://www.google.com/search?q=La+Siesta+Premium+Hang+Be",
    link2Text: "Directions",
    link2Url: "https://www.google.com/maps/search/La+Siesta+Premium+Hang+Be"
  },
  {
    type: "car",
    title: "Sixt Rent a Car",
    reference: "VW Golf (CDAR)",
    startPoint: "LHR Terminal 5",
    endPoint: "Return: Sep 10 @ 5:00 PM",
    date: "Sep 2, 2026",
    time: "11:00 AM",
    link1Text: "Manage Booking",
    link1Url: "https://www.sixt.com/account/#/manage-my-booking-info",
    link2Text: "LHR T5 Map",
    link2Url: "https://maps.google.com/?q=Sixt+London+Heathrow+Terminal+5"
  }
];




