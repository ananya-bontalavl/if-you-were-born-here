import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

interface Props {
  countryData: {
    name: string;
    mortality: number;
    color: string;
  };
}

export default function Chapter1Chart({ countryData }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'pending' | 'rolling' | 'result'>('pending');
  const [userRoll, setUserRoll] = useState<number | null>(null);

  const mortality = countryData.mortality || 0;
  // If the roll is LESS than mortality, the user "dies" (statistically)
  const didSurvive = userRoll !== null ? userRoll >= mortality : true;

  const handleTest = () => {
    setStatus('rolling');
    // Generate a random number between 0 and 100
    const roll = parseFloat((Math.random() * 100).toFixed(2));
    
    setTimeout(() => {
      setUserRoll(roll);
      setStatus('result');
    }, 1500);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    d3.select(containerRef.current).selectAll("svg").remove();

    const width = 340, height = 340, cols = 10, iconSize = 26, gap = 6;
    const svg = d3.select(containerRef.current).append("svg")
      .attr("width", width).attr("height", height).style("overflow", "visible");

    const g = svg.append("g").attr("transform", "translate(5,5)");

    const icons = g.selectAll("g").data(d3.range(100)).enter().append("g")
      .attr("transform", (d, i) => `translate(${(i % cols) * (iconSize + gap)}, ${Math.floor(i / cols) * (iconSize + gap)})`);

    // Draw the Grid
    icons.append("rect")
      .attr("width", iconSize).attr("height", iconSize).attr("rx", 6)
      .attr("fill", (d) => d < mortality ? "#ef4444" : "#22c55e") // Red if in mortality zone, Green otherwise
      .attr("opacity", status === 'pending' ? 0.1 : 0.2);

    if (status === 'result' && userRoll !== null) {
      // Highlight the specific square the user "landed" on
      const userIndex = Math.floor(userRoll);
      
      icons.filter((d) => d === userIndex)
        .append("circle")
        .attr("cx", iconSize / 2).attr("cy", iconSize / 2).attr("r", 0)
        .attr("fill", "#fff")
        .style("filter", "drop-shadow(0 0 8px #fff)")
        .transition().duration(500).attr("r", 10);

      // Light up the whole grid to show the "Danger Zone" vs "Safety Zone"
      icons.select("rect").transition().duration(800).attr("opacity", (d) => d < mortality ? 0.8 : 0.3);
    }
  }, [countryData, status, userRoll, mortality]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      <div ref={containerRef} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px' }} />

      {status === 'pending' && (
        <button onClick={handleTest} style={buttonStyle}>TEST SURVIVAL ODDS</button>
      )}

      {status === 'rolling' && (
        <p style={{ color: '#fff', fontWeight: 900, animation: 'pulse 1s infinite' }}>ROLLING THE DICE...</p>
      )}

      {status === 'result' && (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
          <h3 style={{ 
            fontSize: '2rem', fontWeight: 900, margin: 0, 
            color: didSurvive ? '#22c55e' : '#ef4444' 
          }}>
            {didSurvive ? "YOU SURVIVED" : "YOU DID NOT SURVIVE"}
          </h3>
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '8px' }}>
            Mortality Threshold: <b>{mortality}</b>
          </p>
          <p style={{ color: '#666', fontSize: '0.75rem', maxWidth: '300px', lineHeight: 1.4 }}>
            {didSurvive 
              ? `You are among the ${(100-mortality).toFixed(1)}% who make it to age five in ${countryData.name}.`
              : `Statistically, you would have been one of the ${mortality} children out of 100 in ${countryData.name} who pass away before age five.`}
          </p>
        </div>
      )}
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: '14px 28px', backgroundColor: '#fff', color: '#000', border: 'none',
  borderRadius: '12px', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.1em',
  cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,255,255,0.2)'
};