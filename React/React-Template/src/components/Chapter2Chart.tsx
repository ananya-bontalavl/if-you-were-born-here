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
  const [hasGraduated, setHasGraduated] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [rankMessage, setRankMessage] = useState("");

  const eduValue = countryData.edu || 0;
  const maxAllowedLevel =
    eduValue >= 90 ? 4 :
    eduValue >= 70 ? 3 :
    eduValue >= 50 ? 2 :
    eduValue >= 25 ? 1 : 0;

  const steps = [
    { label: "Primary", hurdle: "Limited early schooling access" },
    { label: "Middle", hurdle: "Financial family pressure" },
    { label: "High School", hurdle: "High dropout rates" },
    { label: "University", hurdle: "Competitive admissions" }
  ];

  const graduationMessages = [
    "Did not complete Primary Education",
    "Graduated from Primary School",
    "Graduated from Middle School",
    "Graduated from High School",
    "Graduated with a University Degree"
  ];

  const [status, setStatus] = useState({
    msg: "Start your education journey",
    sub: "Click below to enroll in Primary School"
  });

  const handleClimb = () => {
    if (currentStep >= maxAllowedLevel) return;
    setIsClimbing(true);
    setStatus({
      msg: "Processing...",
      sub: `Attempting ${steps[currentStep].label}`
    });

    const roll = Math.random() * 100;
    const success = roll < eduValue + 5;

    setTimeout(() => {
      if (success) {
        const nextLevel = currentStep + 1;
        setCurrentStep(nextLevel);
        if (nextLevel >= maxAllowedLevel) {
          setHasGraduated(true);
          setStatus({
            msg: graduationMessages[maxAllowedLevel],
            sub: `In ${countryData.name}, this reflects national attainment levels.`
          });
        } else {
          setStatus({
            msg: `Completed ${steps[currentStep].label}`,
            sub: `Next: ${steps[nextLevel].label}`
          });
        }
      } else {
        setStatus({
          msg: "Step Failed",
          sub: `Hurdle: ${steps[currentStep].hurdle}`
        });
      }
      setIsClimbing(false);
    }, 700);
  };

  useEffect(() => {
    if (!ladderRef.current) return;

    const svg = d3.select(ladderRef.current);
    svg.selectAll("*").remove();

    const width = 260;
    const height = 300;

    const g = svg.append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(90,20)");

    g.selectAll("rect")
      .data(steps)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (_, i) => (3 - i) * 60)
      .attr("width", 100)
      .attr("height", 12)
      .attr("rx", 6)
      .attr("fill", (_, i) =>
        i < currentStep ? countryData.color : "#222"
      );

    g.selectAll("text")
      .data(steps)
      .enter()
      .append("text")
      .attr("x", -15)
      .attr("y", (_, i) => (3 - i) * 60 + 10)
      .attr("text-anchor", "end")
      .style("fill", "#888")
      .style("font-size", "12px")
      .text(d => d.label);

  }, [currentStep, countryData]);

  useEffect(() => {
    if (!showRanking || !rankingRef.current) return;

    const svg = d3.select(rankingRef.current);
    svg.selectAll("*").remove();

    const ranked = countriesData
      .filter(d => d.cat === countryData.cat)
      .sort((a, b) => b.edu - a.edu);

    const rankPosition =
      ranked.findIndex(d => d.name === countryData.name) + 1;

    const total = ranked.length;

    if (rankPosition <= total * 0.3) {
      setRankMessage("Your country is among the global leaders in education. Continued innovation will sustain this advantage.");
    } else if (rankPosition <= total * 0.7) {
      setRankMessage("Your country sits in the middle tier. Strategic reforms could significantly improve its ranking.");
    } else {
      setRankMessage("Your country is trailing behind peers. Strong investment in education policy could shift its global standing.");
    }

    const width = 460;
    const height = 320;

    const rSvg = svg.append("svg")
      .attr("width", width)
      .attr("height", height);

    const x = d3.scaleLinear()
      .domain([0, d3.max(ranked, d => d.edu)!])
      .range([0, 220]);

    const y = d3.scaleBand()
      .domain(ranked.map(d => d.name))
      .range([20, 260])
      .padding(0.4);

    const gRank = rSvg.append("g")
      .attr("transform", "translate(150,10)");

    gRank.selectAll("rect")
      .data(ranked)
      .enter()
      .append("rect")
      .attr("y", d => y(d.name)!)
      .attr("height", y.bandwidth())
      .attr("width", 0)
      .attr("rx", 4)
      .attr("fill", d =>
        d.name === countryData.name
          ? countryData.color
          : "#1a1a1a"
      )
      .transition()
      .duration(900)
      .attr("width", d => x(d.edu));

    // Country labels
    gRank.selectAll(".country")
      .data(ranked)
      .enter()
      .append("text")
      .attr("x", -10)
      .attr("y", d => y(d.name)! + y.bandwidth() / 2 + 4)
      .attr("text-anchor", "end")
      .style("fill", "#aaa")
      .style("font-size", "12px")
      .text(d => d.name);

    // Value labels
    gRank.selectAll(".value")
      .data(ranked)
      .enter()
      .append("text")
      .attr("x", d => x(d.edu) + 6)
      .attr("y", d => y(d.name)! + y.bandwidth() / 2 + 4)
      .style("fill", "#888")
      .style("font-size", "11px")
      .text(d => `${d.edu}`);

  }, [showRanking, countryData, countriesData]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: showRanking ? "space-between" : "center",
        alignItems: "flex-start",
        gap: "40px",
        width: "100%",
        transition: "all 0.8s ease"
      }}
    >

      {/* EDUCATION SECTION */}
      <div
        style={{
          flex: showRanking ? 1 : "0 0 400px",
          textAlign: "center",
          transition: "all 0.8s ease"
        }}
      >
        {!showRanking && currentStep === 0 && (
          <div style={{ fontSize: 18, color: "#aaa", marginBottom: 20 }}>
            Primary → Middle → High School → University
          </div>
        )}

        <div ref={ladderRef}></div>

        <div style={{
          marginTop: 30,
          padding: 20,
          borderRadius: 16,
          background: "#111",
          border: `1px solid ${countryData.color}33`
        }}>
          <h4 style={{ color: "#6366f1" }}>{status.msg}</h4>
          <p style={{ color: "#777", fontSize: 15 }}>{status.sub}</p>

          {!hasGraduated && (
            <button
              onClick={handleClimb}
              disabled={isClimbing}
              style={{
                marginTop: 15,
                padding: "10px 25px",
                borderRadius: 10,
                background: countryData.color,
                border: "none",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              {isClimbing ? "PERSISTING..." : "CONTINUE"}
            </button>
          )}

          {hasGraduated && !showRanking && (
            <button
              onClick={() => setShowRanking(true)}
              style={{
                marginTop: 15,
                padding: "10px 25px",
                borderRadius: 10,
                background: "#fff",
                border: "none",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              VIEW GLOBAL LADDER
            </button>
          )}
        </div>
      </div>

      {/* RANKING SECTION */}
      {showRanking && (
        <div style={{ flex: 1, transition: "all 0.8s ease" }}>
          <div ref={rankingRef}></div>

          {/* Insight Message */}
          <div style={{
            marginTop: 20,
            padding: 15,
            borderRadius: 12,
            background: "#141414",
            color: countryData.color,
            fontSize: 16
          }}>
            {rankMessage}
          </div>
        </div>
      )}

    </div>
  );
}