import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

interface Props {
  countryData: any;
  countriesData: any[];
}

export default function Chapter2Chart({ countryData, countriesData }: Props) {
  const ladderRef = useRef<HTMLDivElement>(null);
  const rankingRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isClimbing, setIsClimbing] = useState(false);
  const [status, setStatus] = useState({ msg: "Start your education", sub: "Click to enroll in Primary School" });

  const eduValue = countryData.edu || 0;
  const maxAllowedLevel = eduValue >= 90 ? 4 : eduValue >= 70 ? 3 : eduValue >= 50 ? 2 : eduValue >= 25 ? 1 : 0;

  const steps = [
    { label: "Primary", goal: "Basic Literacy", hurdle: "Lack of local schools" },
    { label: "Middle", goal: "Core Knowledge", hurdle: "Need to support family" },
    { label: "High School", goal: "Specialization", hurdle: "High tuition fees" },
    { label: "University", goal: "Career Mastery", hurdle: "Competitive placement" }
  ];

  const handleClimb = () => {
    setIsClimbing(true);
    setStatus({ msg: "Processing...", sub: `Attempting to reach ${steps[currentStep].label} level...` });

    // Success logic: country edu score affects the 'roll'
    const roll = Math.random() * 100;
    const success = roll < (eduValue + 5); 

    setTimeout(() => {
      if (success) {
        const nextLevel = currentStep + 1;
        setCurrentStep(nextLevel);
        if (nextLevel === maxAllowedLevel) {
          setStatus({ msg: "Academic Ceiling Reached", sub: `In ${countryData.name}, this is the statistical limit.` });
        } else {
          setStatus({ msg: "Success!", sub: `You've completed ${steps[currentStep].label}!` });
        }
      } else {
        setStatus({ msg: "Step Failed", sub: `Hurdle: ${steps[currentStep].hurdle}` });
      }
      setIsClimbing(false);
    }, 800);
  };

  useEffect(() => {
    if (!ladderRef.current || !rankingRef.current) return;

    // --- LADDER D3 (LEFT SIDE) ---
    const svgL = d3.select(ladderRef.current);
    svgL.selectAll("*").remove();
    
    const width = 250;
    const height = 300;
    const g = svgL.append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(100,20)");

    // Draw Rungs
    g.selectAll("rect")
      .data(steps).enter().append("rect")
      .attr("x", 0)
      .attr("y", (_, i) => (3 - i) * 60)
      .attr("width", 100).attr("height", 12).attr("rx", 6)
      .attr("fill", (_, i) => i < currentStep ? countryData.color : "#222");

    // Labels
    g.selectAll("text")
      .data(steps).enter().append("text")
      .attr("x", -15).attr("y", (_, i) => (3 - i) * 60 + 10)
      .attr("text-anchor", "end").style("fill", "#666").style("font-size", "11px")
      .text(d => d.label);

    // --- RANKING D3 (RIGHT SIDE) ---
    const svgR = d3.select(rankingRef.current);
    svgR.selectAll("*").remove();
    
    const ranked = countriesData.filter(d => d.cat === countryData.cat).sort((a, b) => b.edu - a.edu).slice(0, 6);
    const rSvg = svgR.append("svg").attr("width", 300).attr("height", 300);
    const x = d3.scaleLinear().domain([0, 115]).range([0, 150]);
    const y = d3.scaleBand().domain(ranked.map(d => d.name)).range([0, 240]).padding(0.4);

    const gRank = rSvg.append("g").attr("transform", "translate(110,20)");
    gRank.selectAll("rect").data(ranked).enter().append("rect")
      .attr("y", d => y(d.name)!).attr("height", y.bandwidth()).attr("width", d => x(d.edu))
      .attr("fill", d => d.name === countryData.name ? countryData.color : "#111").attr("rx", 3);

    gRank.selectAll("text").data(ranked).enter().append("text")
      .attr("x", -10).attr("y", d => y(d.name)! + y.bandwidth()/2 + 4)
      .attr("text-anchor", "end").style("fill", "#555").style("font-size", "10px").text(d => d.name);

  }, [currentStep, countryData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', gap: '20px' }}>
        <div ref={ladderRef}></div>
        <div style={{ width: '1px', backgroundColor: '#222', height: '250px' }}></div>
        <div ref={rankingRef}></div>
      </div>

      <div style={{ 
        padding: '20px', borderRadius: '20px', backgroundColor: '#111', 
        border: `1px solid ${countryData.color}33`, width: '100%', textAlign: 'center' 
      }}>
        <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>{status.msg}</h4>
        <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{status.sub}</p>
        
        <button 
          onClick={handleClimb}
          disabled={isClimbing || currentStep >= maxAllowedLevel}
          style={{
            marginTop: '20px', padding: '12px 30px', borderRadius: '12px',
            background: isClimbing ? '#222' : countryData.color,
            color: '#000', border: 'none', fontWeight: 900, cursor: 'pointer',
            opacity: currentStep >= maxAllowedLevel ? 0.3 : 1,
            transition: 'all 0.3s'
          }}
        >
          {isClimbing ? 'PERSISTING...' : currentStep >= maxAllowedLevel ? 'LEVEL CAP REACHED' : `STRIVE FOR ${steps[currentStep].label.toUpperCase()}`}
        </button>
      </div>
    </div>
  );
}