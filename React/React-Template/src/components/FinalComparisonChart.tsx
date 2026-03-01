import React, { useState } from 'react';

// 1. STRICT TYPE DEFINITIONS
interface Props {
  winner: any;
}

interface CountryData {
  name: string;
  cat: string;
  color: string;
  mortality: number;
  gni: number;
  edu: number;
  life: number;
}

// 2. MOCK DATASET
const CHART_DATA: CountryData[] = [
  { name: "United States", cat: "High Income", color: "#0984e3", mortality: 0.6, gni: 71767, edu: 99, life: 77.8 },
  { name: "Germany", cat: "High Income", color: "#0984e3", mortality: 0.3, gni: 64644, edu: 100, life: 81.0 },
  { name: "Japan", cat: "High Income", color: "#0984e3", mortality: 0.2, gni: 46472, edu: 100, life: 84.4 },
  { name: "China", cat: "Upper Middle", color: "#00b894", mortality: 1.1, gni: 21250, edu: 85, life: 78.2 },
  { name: "Brazil", cat: "Upper Middle", color: "#00b894", mortality: 1.3, gni: 17367, edu: 82, life: 73.4 },
  { name: "South Africa", cat: "Upper Middle", color: "#00b894", mortality: 3.2, gni: 15334, edu: 76, life: 61.5 },
  { name: "India", cat: "Lower Middle", color: "#fdcb6e", mortality: 2.5, gni: 8293, edu: 74, life: 67.2 },
  { name: "Vietnam", cat: "Lower Middle", color: "#fdcb6e", mortality: 1.6, gni: 13075, edu: 85, life: 73.6 },
  { name: "Bangladesh", cat: "Lower Middle", color: "#fdcb6e", mortality: 2.2, gni: 7373, edu: 68, life: 72.4 },
  { name: "Ethiopia", cat: "Low Income", color: "#d63031", mortality: 4.8, gni: 2800, edu: 35, life: 65.0 },
  { name: "Afghanistan", cat: "Low Income", color: "#d63031", mortality: 5.4, gni: 1500, edu: 40, life: 62.0 },
  { name: "Somalia", cat: "Low Income", color: "#d63031", mortality: 8.4, gni: 1200, edu: 20, life: 55.0 }
];

const CATEGORIES = ["High Income", "Upper Middle", "Lower Middle", "Low Income"];

const FinalComparisonChart: React.FC<Props> = ({ winner }) => {
  const [activeTiers, setActiveTiers] = useState<string[]>(CATEGORIES);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const toggleTier = (tier: string) => {
    setActiveTiers(prev => 
      prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
    );
  };

  // SVG SCALING MATH
  const width = 800;
  const height = 400;
  const padding = 40;
  
  const xSurv = padding;
  const xEdu = padding + (width - 2 * padding) * 0.33;
  const xGNI = padding + (width - 2 * padding) * 0.66;
  const xLife = width - padding;

  // Ensure safe numbers to avoid NaN errors in SVG paths
  const safeNumber = (val: number | undefined | null, fallback: number) => 
    (typeof val === 'number' && !isNaN(val)) ? val : fallback;

  const scaleSurv = (val: number) => padding + ((safeNumber(val, 5) - 0) / (10 - 0)) * (height - 2 * padding);
  const scaleEdu = (val: number) => height - padding - ((safeNumber(val, 50) - 0) / (100 - 0)) * (height - 2 * padding);
  const scaleGNI = (val: number) => height - padding - ((safeNumber(val, 10000) - 0) / (80000 - 0)) * (height - 2 * padding);
  const scaleLife = (val: number) => height - padding - ((safeNumber(val, 65) - 50) / (85 - 50)) * (height - 2 * padding);

  return (
    <div style={{
      width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '40px',
      backgroundColor: 'rgba(20, 20, 25, 0.9)', borderRadius: '32px',
      border: winner ? `1px solid ${winner.color}40` : '1px solid #333', 
      boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
    }}>
      
      {/* HEADER & CONTROLS */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#fff' }}>
          THE GLOBAL SYSTEM
        </h2>
        <p style={{ color: '#888', marginTop: '10px' }}>
          Compare your simulated life in <strong style={{ color: winner?.color || '#fff' }}>{winner?.name || 'your country'}</strong> against the rest of the world.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => toggleTier(cat)}
              style={{
                padding: '8px 16px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s ease', textTransform: 'uppercase',
                backgroundColor: activeTiers.includes(cat) ? '#333' : 'transparent',
                color: activeTiers.includes(cat) ? '#fff' : '#555',
                border: `1px solid ${activeTiers.includes(cat) ? '#555' : '#333'}`
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PARALLEL COORDINATES SVG PLOT */}
      <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
          
          {/* 1. DRAW POLYLINES */}
          {CHART_DATA.map((d, i) => {
            const isWinner = winner && d.name === winner.name;
            const isHovered = d.name === hoveredCountry;
            const isVisible = activeTiers.includes(d.cat);
            
            if (!isVisible && !isWinner) return null;

            const pathStr = `M ${xSurv} ${scaleSurv(d.mortality)} L ${xEdu} ${scaleEdu(d.edu)} L ${xGNI} ${scaleGNI(d.gni)} L ${xLife} ${scaleLife(d.life)}`;

            return (
              <path
                key={i}
                d={pathStr}
                fill="none"
                stroke={isWinner ? winner.color : d.color}
                strokeWidth={isWinner ? 4 : (isHovered ? 3 : 1)}
                opacity={isWinner ? 1 : (isHovered ? 0.8 : 0.2)}
                // Replaced raw inline CSS transitions with safer React styles to prevent strict SVG errors
                style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                onMouseEnter={() => setHoveredCountry(d.name)}
                onMouseLeave={() => setHoveredCountry(null)}
              />
            );
          })}

          {/* 2. DRAW VERTICAL AXES */}
          {[
            { x: xSurv, label: "Mortality (per 100)", min: "10", max: "0" },
            { x: xEdu, label: "Education (%)", min: "0", max: "100" },
            { x: xGNI, label: "GNI (PPP $)", min: "$0", max: "$80k" },
            { x: xLife, label: "Life Exp. (Yrs)", min: "50", max: "85" }
          ].map((axis, i) => (
            <g key={i}>
              <line x1={axis.x} y1={padding} x2={axis.x} y2={height - padding} stroke="#555" strokeWidth="2" />
              <text x={axis.x} y={padding - 15} fill="#aaa" fontSize="12" fontWeight="800" textAnchor="middle" style={{ textTransform: 'uppercase' }}>
                {axis.label}
              </text>
              <text x={axis.x} y={padding + 10} fill="#777" fontSize="10" textAnchor="middle" dx={-20}>{axis.max}</text>
              <text x={axis.x} y={height - padding} fill="#777" fontSize="10" textAnchor="middle" dx={-20}>{axis.min}</text>
            </g>
          ))}

        </svg>
      </div>

      {/* HIGHLIGHT / TOOLTIP AREA */}
      <div style={{ marginTop: '20px', textAlign: 'center', height: '30px' }}>
        {(hoveredCountry || winner) && (
          <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
            <span style={{ color: '#888' }}>Viewing: </span> 
            <span style={{ color: hoveredCountry ? '#fff' : (winner?.color || '#fff') }}>
              {hoveredCountry || `${winner?.name} (Your Life)`}
            </span>
          </p>
        )}
      </div>

    </div>
  );
};

export default FinalComparisonChart;