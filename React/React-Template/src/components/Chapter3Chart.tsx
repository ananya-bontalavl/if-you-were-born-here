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
  const gni = countryData.gni || 5000;
  
  const getDescription = (val: number) => {
    if (val < 3000) return "Most of your income goes toward food and basic shelter. Healthcare and saving are largely out of reach.";
    if (val < 8000) return "You meet basic needs, but a single financial shock can be devastating. Long-term planning is a rare privilege.";
    if (val < 15000) return "Life is stable, but comfort requires hard work. You earn more than 70% of the global population.";
    if (val < 30000) return "You have real breathing room. Most daily stresses aren't about survival, but about choices.";
    return "Financial anxiety is largely removed. You are in the top tier of global earners with access to high-end security.";
  };

  const earningsPerClick = 20 + (Math.min(gni, 100000) / 100000) * 10; 

  const handleWork = () => {
    setIsWorking(true);
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
    const barHeight = 14;
    const gap = 4;

    const svg = svgElement.append("svg")
      .attr("width", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", "translate(10, 40)");

    const segments = [
      { min: 0, max: 3000, color: "#ef4444" },
      { min: 3000, max: 8000, color: "#f97316" },
      { min: 8000, max: 15000, color: "#eab308" },
      { min: 15000, max: 30000, color: "#3b82f6" },
      { min: 30000, max: 60000, color: "#22c55e" }
    ];

    const segmentWidth = (width - 20 - (segments.length - 1) * gap) / segments.length;

    segments.forEach((s, i) => {
      const xPos = i * (segmentWidth + gap);
      
      svg.append("rect")
        .attr("x", xPos)
        .attr("y", 0)
        .attr("width", segmentWidth)
        .attr("height", barHeight)
        .attr("rx", 4)
        .attr("fill", s.color)
        .attr("opacity", 0.2);
    });

    const getGniX = (val: number) => {
      // Find which bucket the GNI falls into
      const index = segments.findIndex(s => val <= s.max);
      const activeIndex = index === -1 ? segments.length - 1 : index;
      const bucket = segments[activeIndex];
      
      // Calculate how far into that specific bucket the GNI is (percentage)
      const internalPct = (val - bucket.min) / (bucket.max - bucket.min);
      const clampedPct = Math.max(0, Math.min(1, internalPct));
      
      // Starting X of bucket + (percentage of segment width)
      return activeIndex * (segmentWidth + gap) + (clampedPct * segmentWidth);
    };

    const gniX = getGniX(gni);

    svg.append("rect")
      .attr("x", gniX - 2)
      .attr("y", -6)
      .attr("width", 4)
      .attr("height", barHeight + 12)
      .attr("fill", countryData.color)
      .attr("rx", 2)
      .style("filter", `drop-shadow(0 0 4px ${countryData.color})`);

    svg.append("text")
      .attr("x", gniX)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "11px")
      .style("font-weight", "900")
      .text(`$${Math.round(gni).toLocaleString()}`);

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