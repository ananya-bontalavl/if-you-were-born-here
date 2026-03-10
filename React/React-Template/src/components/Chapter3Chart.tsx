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

  const gniValues = useMemo(() => {
    const data = GNI_DATA.find(d => d.country === countryData.name);
    return data || { gni1: 0, gni2: 0, gni3: 0 };
  }, [countryData.name]);

  const currentGni = useMemo(() => {
    if (clicks === 0) return 0;
    if (clicks === 1) return gniValues.gni1;
    if (clicks === 2) return gniValues.gni2;
    return gniValues.gni3; // This matches the Beeswarm's Y-axis
  }, [clicks, gniValues]);

  const getDescription = (val: number) => {
    if (clicks === 0) return `In ${countryData.name}, your economic fate is yet to be determined.`;
    if (val < 3000) return "Most of your income goes toward food and basic shelter.";
    if (val < 8000) return "You meet basic needs, but a single financial shock can be devastating.";
    if (val < 15000) return "Life is stable, but comfort requires hard work.";
    if (val < 30000) return "You have real breathing room. Daily stresses aren't about survival.";
    return "Financial anxiety is largely removed. You are in the top tier of global earners.";
  };

  const handleWork = () => {
    setIsWorking(true);
    setTimeout(() => {
      setClicks(prev => Math.min(3, prev + 1));
      setIsWorking(false);
    }, 400);
  };

  useEffect(() => {
    if (!stackRef.current) return;
    const svgElement = d3.select(stackRef.current);
    svgElement.selectAll("*").remove();

    const width = 500;
    const height = 130;
    const barHeight = 35;
    const margin = { top: 45, right: 35, bottom: 35, left: 25 };
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
      return i * barWidth + Math.max(0, Math.min(1, t)) * barWidth;
    };

    segments.forEach((seg, i) => {
      g.append("rect").attr("x", i * barWidth).attr("y", 0).attr("width", barWidth).attr("height", barHeight).attr("fill", seg.color).attr("rx", i === 0 || i === 4 ? 4 : 0);
      g.append("text").attr("x", i * barWidth + barWidth / 2).attr("y", barHeight / 2 + 4).attr("text-anchor", "middle").attr("fill", "#000").style("font-size", "10px").style("font-weight", "900").text(seg.label.toUpperCase());
    });

    const gniX = gniToX(Math.min(currentGni, 60000));
    g.append("line").attr("x1", gniX).attr("x2", gniX).attr("y1", -8).attr("y2", barHeight + 8).attr("stroke", "#fff").attr("stroke-width", 3);
    g.append("text").attr("x", gniX).attr("y", -18).attr("text-anchor", "middle").attr("fill", "#fff").style("font-weight", "900").text(clicks === 0 ? "$0" : `$${Math.round(currentGni).toLocaleString()}`);
  }, [currentGni, clicks]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div ref={stackRef}></div>

      <div style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: `1px solid rgba(255,255,255,0.05)`, textAlign: 'center' }}>
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#fff', lineHeight: 1.6, minHeight: '60px' }}>
          <strong style={{ color: countryData.color }}>{clicks > 0 && "STATUS: "}</strong>
          {getDescription(currentGni)}
        </p>
        <button onClick={handleWork} disabled={clicks >= 3 || isWorking} style={{ padding: '14px 40px', borderRadius: '100px', background: clicks >= 3 ? '#111' : (isWorking ? '#333' : '#fff'), color: '#000', fontWeight: 900, cursor: 'pointer' }}>
          {clicks >= 3 ? 'LIFETIME SECURED' : isWorking ? 'CALCULATING...' : `PERFORM LABOR`}
        </button>
      </div>

      {clicks > 0 && (
        <div style={{ marginTop: '20px', animation: 'fadeIn 1s ease-in' }}>
          <Chapter3Chart2 selectedCountry={countryData} />
        </div>
      )}
    </div>
  );
}