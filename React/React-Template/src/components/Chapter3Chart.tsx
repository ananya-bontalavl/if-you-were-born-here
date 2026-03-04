import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

interface Props {
  countryData: any;
}

export default function Chapter3Chart({ countryData }: Props) {
  const stackRef = useRef<HTMLDivElement>(null);
  const [stability, setStability] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [isWorking, setIsWorking] = useState(false);

  // Using 'gni' key to match your COUNTRY_DATA
  const gni = countryData.gni || 5000;
  
  const getDescription = (val: number) => {
    if (val < 3000) return "Most of your income goes toward food and basic shelter. Healthcare and saving are largely out of reach.";
    if (val < 8000) return "You meet basic needs, but a single financial shock can be devastating. Long-term planning is a rare privilege.";
    if (val < 15000) return "Life is stable, but comfort requires hard work. You earn more than 70% of the global population.";
    if (val < 30000) return "You have real breathing room. Most daily stresses aren't about survival, but about choices.";
    return "Financial anxiety is largely removed. You are in the top tier of global earners with access to high-end security.";
  };

  // Calibrated for 4-5 clicks: 
  // High income (~70k) gets ~25% per click (4 clicks)
  // Low income (~1k) gets ~20% per click (5 clicks)
  const earningsPerClick = 20 + (Math.min(gni, 100000) / 100000) * 10; 

  const handleWork = () => {
    setIsWorking(true);
    // Short delay for "feel"
    setTimeout(() => {
      setClicks(prev => prev + 1);
      setStability(prev => Math.min(100, prev + earningsPerClick));
      setIsWorking(false);
    }, 100);
  };

  useEffect(() => {
    if (!countryData || !stackRef.current) return;
    
    const svgElement = d3.select(stackRef.current);
    svgElement.selectAll("*").remove();

    const width = 450;
    const height = 80;
    const barHeight = 12;

    const svg = svgElement.append("svg")
      .attr("width", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", "translate(10, 30)");

    const segments = [
      { max: 3000, color: "#ef4444" },
      { max: 8000, color: "#f97316" },
      { max: 15000, color: "#eab308" },
      { max: 30000, color: "#3b82f6" },
      { max: 60000, color: "#22c55e" }
    ];

    const x = d3.scaleLinear().domain([0, 60000]).range([0, width - 20]);

    let lastX = 0;
    segments.forEach(s => {
      const currentX = x(s.max);
      svg.append("rect")
        .attr("x", lastX).attr("y", 0)
        .attr("width", Math.max(0, currentX - lastX))
        .attr("height", barHeight).attr("rx", 6)
        .attr("fill", s.color).attr("opacity", 0.15);
      lastX = currentX;
    });

    const gniX = x(Math.min(gni, 60000));
    svg.append("rect")
      .attr("x", gniX - 2).attr("y", -5)
      .attr("width", 4).attr("height", barHeight + 10)
      .attr("fill", countryData.color).attr("rx", 2);

    svg.append("text")
      .attr("x", gniX).attr("y", -12).attr("text-anchor", "middle")
      .style("fill", "#fff").style("font-size", "10px").style("font-weight", "900")
      .text(`$${Math.round(gni).toLocaleString()} (PPP)`);

  }, [countryData, gni]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div ref={stackRef} style={{ width: '100%' }}></div>

      <div style={{ 
        padding: '24px', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.03)', 
        border: `1px solid ${countryData.color}22`, textAlign: 'center'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '10px', color: '#666', fontWeight: 900, textTransform: 'uppercase' }}>Stability Achieved</span>
            <span style={{ fontSize: '10px', color: countryData.color, fontWeight: 900 }}>{Math.round(stability)}%</span>
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#111', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${stability}%`, height: '100%', backgroundColor: countryData.color, 
              boxShadow: `0 0 10px ${countryData.color}55`, transition: 'width 0.3s ease-out' 
            }} />
          </div>
        </div>

        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#888', lineHeight: 1.6, minHeight: '40px' }}>
          {stability >= 100 ? getDescription(gni) : `In ${countryData.name}, stability is built through labor. Complete your shifts to secure your future.`}
        </p>
        
        <button 
          onClick={handleWork}
          disabled={stability >= 100 || isWorking}
          style={{
            padding: '12px 36px', borderRadius: '100px',
            background: stability >= 100 ? '#111' : (isWorking ? '#222' : countryData.color),
            color: '#000', border: 'none', fontWeight: 900, cursor: 'pointer',
            opacity: stability >= 100 ? 0.3 : 1, transition: 'all 0.2s',
            fontSize: '11px', letterSpacing: '0.1em'
          }}
        >
          {stability >= 100 ? 'STABILITY SECURED' : isWorking ? 'WORKING...' : 'PERFORM LABOR'}
        </button>
      </div>
    </div>
  );
}