// Delhi graph data with major landmarks and routes

export const DELHI_NODES = {
  CP: {
    name: 'Connaught Place',
    coordinate: [28.6315, 77.2167],
    type: 'commercial'
  },
  IG: {
    name: 'India Gate',
    coordinate: [28.6129, 77.2295],
    type: 'monument'
  },
  AIIMS: {
    name: 'AIIMS Delhi',
    coordinate: [28.5672, 77.2100],
    type: 'hospital'
  },
  NDR: {
    name: 'New Delhi Railway Station',
    coordinate: [28.6430, 77.2194],
    type: 'transport'
  },
  ISBT: {
    name: 'Kashmere Gate ISBT',
    coordinate: [28.6655, 77.2273],
    type: 'transport'
  },
  HK: {
    name: 'Hauz Khas',
    coordinate: [28.5494, 77.2001],
    type: 'residential'
  },
  IIT: {
    name: 'IIT Delhi',
    coordinate: [28.5450, 77.1926],
    type: 'education'
  },
  QUTUB: {
    name: 'Qutub Minar',
    coordinate: [28.5244, 77.1855],
    type: 'monument'
  },
  DU: {
    name: 'Delhi University',
    coordinate: [28.6962, 77.2137],
    type: 'education'
  },
  LOTUS: {
    name: 'Lotus Temple',
    coordinate: [28.5535, 77.2588],
    type: 'monument'
  },
  AIRPORT: {
    name: 'IGI Airport',
    coordinate: [28.5562, 77.1000],
    type: 'transport'
  },
  GURGAON: {
    name: 'Gurgaon City Center',
    coordinate: [28.4595, 77.0266],
    type: 'commercial'
  }
};

export const DELHI_EDGES = [
  // Central Delhi connections
  { u: 'CP', v: 'IG', weight: 3.2 },
  { u: 'CP', v: 'NDR', weight: 1.8 },
  { u: 'CP', v: 'AIIMS', weight: 6.5 },
  
  // North Delhi connections
  { u: 'NDR', v: 'ISBT', weight: 3.1 },
  { u: 'ISBT', v: 'DU', weight: 4.2 },
  { u: 'CP', v: 'DU', weight: 7.8 },
  
  // South Delhi connections
  { u: 'AIIMS', v: 'HK', weight: 3.0 },
  { u: 'HK', v: 'IIT', weight: 1.4 },
  { u: 'IIT', v: 'QUTUB', weight: 2.8 },
  { u: 'AIIMS', v: 'IIT', weight: 4.2 },
  
  // East Delhi connections
  { u: 'IG', v: 'LOTUS', weight: 5.1 },
  { u: 'CP', v: 'LOTUS', weight: 8.3 },
  
  // West Delhi connections
  { u: 'CP', v: 'AIRPORT', weight: 15.2 },
  { u: 'AIIMS', v: 'AIRPORT', weight: 12.8 },
  { u: 'IIT', v: 'AIRPORT', weight: 8.9 },
  
  // NCR connections
  { u: 'AIIMS', v: 'GURGAON', weight: 18.5 },
  { u: 'IIT', v: 'GURGAON', weight: 16.2 },
  { u: 'AIRPORT', v: 'GURGAON', weight: 14.7 },
  
  // Cross connections
  { u: 'IG', v: 'AIIMS', weight: 5.8 },
  { u: 'IG', v: 'HK', weight: 8.4 },
  { u: 'DU', v: 'IG', weight: 9.1 },
  { u: 'HK', v: 'LOTUS', weight: 12.3 }
];

// Generate realistic traffic data based on time and location
export const generateTrafficData = () => {
  const currentHour = new Date().getHours();
  const trafficData = {};

  DELHI_EDGES.forEach(edge => {
    const edgeKey = `${edge.u}-${edge.v}`;
    
    // Base traffic multiplier
    let multiplier = 1.0;

    // Morning rush hour (7-10 AM)
    if (currentHour >= 7 && currentHour <= 10) {
      multiplier += 0.3 + Math.random() * 0.4;
    }
    // Evening rush hour (5-8 PM)
    else if (currentHour >= 17 && currentHour <= 20) {
      multiplier += 0.4 + Math.random() * 0.5;
    }
    // Lunch time (12-2 PM)
    else if (currentHour >= 12 && currentHour <= 14) {
      multiplier += 0.2 + Math.random() * 0.2;
    }
    // Late night (10 PM - 6 AM)
    else if (currentHour >= 22 || currentHour <= 6) {
      multiplier -= 0.2 + Math.random() * 0.1;
    }

    // Commercial areas have more traffic
    if (edge.u === 'CP' || edge.v === 'CP') {
      multiplier += 0.2;
    }

    // Transport hubs have more traffic
    if (['NDR', 'ISBT', 'AIRPORT'].includes(edge.u) || ['NDR', 'ISBT', 'AIRPORT'].includes(edge.v)) {
      multiplier += 0.15;
    }

    // Ensure minimum multiplier of 0.8
    multiplier = Math.max(0.8, multiplier);
    
    trafficData[edgeKey] = parseFloat(multiplier.toFixed(2));
    trafficData[`${edge.v}-${edge.u}`] = trafficData[edgeKey]; // Bidirectional
  });

  return trafficData;
};

// Generate AQI data for different areas of Delhi
export const generateAQIData = () => {
  const aqiData = {};
  const currentMonth = new Date().getMonth();
  
  // Base AQI values for different areas (winter months have higher pollution)
  const baseAQI = {
    CP: 180,      // Commercial area - high pollution
    IG: 160,      // Tourist area - moderate pollution  
    AIIMS: 170,   // Hospital area - high due to traffic
    NDR: 190,     // Railway station - very high pollution
    ISBT: 185,    // Bus terminal - high pollution
    HK: 150,      // Upscale residential - lower pollution
    IIT: 140,     // Educational campus - lower pollution
    QUTUB: 135,   // Heritage site - lower pollution
    DU: 165,      // University area - moderate pollution
    LOTUS: 155,   // Temple area - moderate pollution
    AIRPORT: 175, // Airport area - high due to traffic
    GURGAON: 195  // Industrial area - highest pollution
  };

  Object.keys(baseAQI).forEach(nodeId => {
    let aqi = baseAQI[nodeId];
    
    // Winter months (Nov-Feb) have higher AQI
    if (currentMonth >= 10 || currentMonth <= 1) {
      aqi += 20 + Math.random() * 30;
    }
    // Summer months (Mar-Jun) have moderate AQI
    else if (currentMonth >= 2 && currentMonth <= 5) {
      aqi += Math.random() * 20;
    }
    // Monsoon months (Jul-Sep) have lower AQI
    else {
      aqi -= 10 + Math.random() * 20;
    }

    // Add some random variation
    aqi += (Math.random() - 0.5) * 20;
    
    // Ensure AQI is within realistic bounds
    aqi = Math.max(50, Math.min(500, Math.round(aqi)));
    
    aqiData[nodeId] = aqi;
  });

  return aqiData;
};