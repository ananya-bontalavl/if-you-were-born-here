import React, { useState, useEffect } from 'react';
import Globe from 'react-globe.gl';
import { RotateCcw, ChevronRight } from 'lucide-react';

interface Props {
  winner: any;
  globeRef: any;
  setStage: any;
}

const GlobeSpinning = ({ winner, globeRef, setStage }: Props) => {
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    // Load standard GeoJSON data to map out the borders of every country
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => setCountries(data.features));
  }, []);

  // Map the country's longitude (-180 to +180) to a 360-degree rainbow spectrum
  const getRainbowColor = (feat: any) => {
    let lng = 0;
    try {
      if (feat.geometry.type === 'Polygon') {
        lng = feat.geometry.coordinates[0][0][0];
      } else if (feat.geometry.type === 'MultiPolygon') {
        lng = feat.geometry.coordinates[0][0][0][0];
      }
    } catch (e) {
      lng = 0;
    }
    
    // Convert longitude to a Hue value (0 to 360)
    const hue = ((lng + 180) / 360) * 360;
    return `hsla(${hue}, 75%, 55%, 0.85)`; // 0.85 opacity for a glowing glass effect
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 1s ease-out' }}>
      
      <div style={{ 
        width: '400px', height: '400px', borderRadius: '50%', overflow: 'hidden', 
        backgroundColor: 'rgba(20, 25, 35, 0.4)', 
        boxShadow: `0 0 120px ${winner.color}60, inset 0 0 40px rgba(255,255,255,0.15)`, 
        border: `1px solid ${winner.color}80` 
      }}>
        <Globe
          ref={globeRef}
          width={400}
          height={400}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          
          // --- POLYGON SETTINGS FOR RAINBOW COUNTRIES ---
          polygonsData={countries}
          // FIXED: Added (d: any) to satisfy TypeScript
          polygonAltitude={(d: any) => (d.properties.NAME === winner.name || d.properties.ADMIN === winner.name) ? 0.05 : 0.01}
          // FIXED: Added (d: any) to satisfy TypeScript
          polygonCapColor={(d: any) => (d.properties.NAME === winner.name || d.properties.ADMIN === winner.name) ? winner.color : getRainbowColor(d)}
          polygonSideColor={() => 'rgba(0, 0, 0, 0.3)'}
          polygonStrokeColor={() => '#000'}

          // --- ATMOSPHERE & RADAR ---
          showAtmosphere={true}
          atmosphereColor={winner.color}
          atmosphereAltitude={0.25}
          ringsData={[winner]}
          ringLat="lat"
          ringLng="lng"
          ringColor={() => winner.color}
          ringMaxRadius={12}
          ringPropagationSpeed={2}
          ringRepeatPeriod={800}
        />
      </div>

      <div style={{ marginTop: '2.5rem', textAlign: 'center', animation: 'fadeInUp 0.6s ease-out' }}>
        <p style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
          Target Locked
        </p>
        <h3 style={{ fontSize: '5rem', fontWeight: 900, margin: '0.5rem 0', color: winner.color, letterSpacing: '-0.03em' }}>
          {winner.name}
        </h3>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button 
            onClick={() => window.location.reload()} 
            style={{ background: 'none', border: '1px solid #333', padding: '0.8rem 1.5rem', color: '#888', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RotateCcw size={14} /> RE-ROLL LIFE
          </button>
          <button 
            onClick={() => setStage('simulator')} 
            style={{ backgroundColor: '#fff', color: '#000', padding: '0.8rem 2.5rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 900, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            START STORY <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobeSpinning;