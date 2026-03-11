import React, { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import { GNI_DATA } from "../data/gni_processed";
import Chapter3Chart2 from "./Chapter3Chart2"; 

interface Props {
  countryData: any;
}

export default function Chapter3Chart({ countryData }: Props) {
  const stackRef = useRef<HTMLDivElement>(null);
  const [clicks, setClicks] = useState(0); 
  const [isWorking, setIsWorking] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const gniValues = useMemo(() => {
    const data = GNI_DATA.find(d => d.country === countryData.name);
    return data || { gni1: 0, gni2: 0, gni3: 0 };
  }, [countryData.name]);

  const currentGni = useMemo(() => {
    if (clicks === 0) return 0;
    if (clicks === 1) return gniValues.gni1;
    if (clicks === 2) return gniValues.gni2;
    return gniValues.gni3;
  }, [clicks, gniValues]);

  const getDescription = (val: number) => {
    if (clicks === 0) return `In ${countryData.name}, your economic fate is yet to be determined. Perform labor to see your childhood reality.`;
    if (val < 3000) return "Most of your income goes toward food and basic shelter. Healthcare and saving are largely out of reach.";
    if (val < 8000) return "You meet basic needs, but a single financial shock can be devastating. Long-term planning is a rare privilege.";
    if (val < 15000) return "Life is stable, but comfort requires hard work. You earn more than 70% of the global population.";
    if (val < 30000) return "You have real breathing room. Most daily stresses aren't about survival, but about choices.";
    return "Financial anxiety is largely removed. You are in the top tier of global earners with access to high-end security.";
  };

  const handleWork = () => {
    setIsWorking(true);
    setTimeout(() => {
      setClicks(prev => Math.min(3, prev + 1));
      setIsWorking(false);
    }, 400);
  };

  const handleShowComparison = () => {
    setShowComparison(true);
  };

  useEffect(() => {
    if (!stackRef.current) return;
    const svgElement = d3.select(stackRef.current);
    svgElement.selectAll("*").remove();

    const width = 500;
    const height = 130;
    const barHeight = 35;
    const margin = { top: 45, right: 25, bottom: 35, left: 25 };
    const innerWidth = width - margin.left - margin.right;

    const svg = svgElement.append("svg").attr("width", "100%").attr("viewBox", `0 0 ${width} ${height}`);
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const segments = [
      { label: "Survival",    color: "#ef4444", min: 0,     max: 3000  },
      { label: "Basic",       color: "#f97316", min: 3000,  max: 8000  },
      { label: "Stable",      color: "#eab308", min: 8000,  max: 15000 },
      { label: "Comfortable", color: "#3b82f6", min: 15000, max: 30000 },
      { label: "Wealthy",     color: "#22c55e", min: 30000, max: 60000 },
    ];

    const barWidth = innerWidth / segments.length;
    const gniToX = (val: number) => {
      const idx = segments.findIndex(s => val <= s.max);
      const i = idx < 0 ? segments.length - 1 : idx;
      const seg = segments[i];
      const t = (val - seg.min) / (seg.max - seg.min); 
      const clampedT = Math.max(0, Math.min(1, t));
      return i * barWidth + clampedT * barWidth;
    };

    segments.forEach((seg, i) => {
      g.append("rect").attr("x", i * barWidth).attr("y", 0).attr("width", barWidth).attr("height", barHeight).attr("fill", seg.color).attr("opacity", 0.9).attr("rx", i === 0 ? 4 : i === segments.length - 1 ? 4 : 0);
      g.append("text").attr("x", i * barWidth + barWidth / 2).attr("y", barHeight / 2 + 4).attr("text-anchor", "middle").attr("fill", "#000").style("font-size", "10px").style("font-weight", "900").text(seg.label.toUpperCase());
    });

    const gniX = gniToX(Math.min(currentGni, 60000));
    g.append("line").attr("x1", gniX).attr("x2", gniX).attr("y1", -8).attr("y2", barHeight + 8).attr("stroke", "#fff").attr("stroke-width", 3)
      .style("filter", "drop-shadow(0 0 6px rgba(255,255,255,0.8))");
    g.append("text").attr("x", gniX).attr("y", -18).attr("text-anchor", "middle").attr("fill", "#fff").style("font-weight", "900").style("font-size", "14px").text(clicks === 0 ? "$0" : `$${Math.round(currentGni).toLocaleString()}`);
    const boundaryLabels = ["$0", "$3k", "$8k", "$15k", "$30k", "$60k+"];
    boundaryLabels.forEach((label, i) => {
      g.append("text")
        .attr("x", i * barWidth)
        .attr("y", barHeight + 18)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "#666")
        .text(label);
    });
  }, [currentGni, clicks]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div ref={stackRef} style={{ width: '100%' }}></div>

      <div style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: `1px solid rgba(255,255,255,0.05)`, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '15px' }}>
          {[1, 2, 3].map(step => (
            <div key={step} style={{
              width: '40px', height: '4px', borderRadius: '2px',
              backgroundColor: clicks >= step ? countryData.color : '#222',
              transition: 'background-color 0.4s'
            }} />
          ))}
        </div>
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: countryData.color, lineHeight: 1.6, minHeight: '60px' }}>
          <strong>{clicks === 1 ? "CHILDHOOD: " : clicks === 2 ? "PRIME YEARS: " : clicks === 3 ? "LATER LIFE: " : ""}</strong>
          {getDescription(currentGni)}
        </p>
        <button onClick={handleWork} disabled={clicks >= 3 || isWorking} style={{ padding: '14px 40px', borderRadius: '100px', background: clicks >= 3 ? '#111' : (isWorking ? '#333' : '#fff'), color: '#000', border: 'none', fontWeight: 900, cursor: 'pointer',
            opacity: clicks >= 3 ? 0.3 : 1, transition: 'all 0.2s',
            fontSize: '12px', letterSpacing: '0.1em',
            boxShadow: clicks < 3 && !isWorking ? `0 4px 15px ${countryData.color}44` : 'none'
          }}
        >
          {clicks >= 3 ? 'LIFETIME SECURED' : isWorking ? 'CALCULATING...' : `PERFORM LABOR`}
        </button>

        {clicks === 3 && !showComparison && (
          <button onClick={handleShowComparison} style={{ marginTop: '16px', padding: '12px 30px', borderRadius: '50px', background: countryData.color, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
            Show Comparison Chart
          </button>
        )}
      </div>
      {showComparison && (
        <div style={{ marginTop: '20px', animation: 'fadeIn 1s ease-in' }}>
          <Chapter3Chart2 selectedCountry={countryData} />
        </div>
      )}
    </div>
  );
}