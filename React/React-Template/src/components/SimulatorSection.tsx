import React, { useEffect, useRef, useState } from 'react';
import FinalComparisonChart from './FinalComparisonChart';
import Chapter1Chart from './Chapter1Chart'; 
import Chapter2Chart from './Chapter2Chart';
import Chapter3Chart from './Chapter3Chart';
import { COUNTRIES } from '../data/countries';

interface Props {
  winner: any;
  setActiveChapter: (chapter: number) => void;
}

const SimulatorSection = ({ winner, setActiveChapter }: Props) => {
  const chapter1Ref = useRef<HTMLDivElement>(null);
  const chapter2Ref = useRef<HTMLDivElement>(null);
  const chapter3Ref = useRef<HTMLDivElement>(null);
  const chapter4Ref = useRef<HTMLDivElement>(null);

  const [localChapter, setLocalChapter] = useState(1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let chapterNum = 1;
            if (entry.target.id === 'chapter-1') chapterNum = 1;
            if (entry.target.id === 'chapter-2') chapterNum = 2;
            if (entry.target.id === 'chapter-3') chapterNum = 3;
            if (entry.target.id === 'chapter-4') chapterNum = 4;
            
            setActiveChapter(chapterNum); 
            setLocalChapter(chapterNum);  
          }
        });
      },
      { threshold: 0.6 } 
    );

    if (chapter1Ref.current) observer.observe(chapter1Ref.current);
    if (chapter2Ref.current) observer.observe(chapter2Ref.current);
    if (chapter3Ref.current) observer.observe(chapter3Ref.current);
    if (chapter4Ref.current) observer.observe(chapter4Ref.current);

    return () => observer.disconnect();
  }, [setActiveChapter]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Sticky Background Graph Area */}
      <div style={{
        position: 'sticky', top: 0, height: '100vh', width: '100%', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1
      }}>
        <div id="graph-stage" style={{
          width: '900px', height: '550px', backgroundColor: '#0a0a0a', 
          borderRadius: '50px', border: '1px solid #222', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 0 50px rgba(0,0,0,1)'
        }}>
          
          <p style={{ color: '#333', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '10px' }}>
            Visualization Stage: {winner.name} (Chapter {localChapter})
          </p>

        </div>
      </div>

      {/* Scrolling Chapters */}
      <div style={{ position: 'relative', zIndex: 10, marginTop: '-100vh', width: '100%' }}>
        
        {/* CHAPTER 1 */}
        <section id="chapter-1" ref={chapter1Ref} style={sectionStyle}>
          <div style={cardStyle}>
            <span style={badgeStyle}>Chapter 1</span>
            <h2 style={titleStyle}>Survival</h2>
            <p style={descriptionStyle}>
              The first hurdle is reaching age five. In {winner.name}, this is a matter of structural probability. 
              Your survival is the baseline for everything that follows.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Chapter1Chart countryData={winner} />
            </div>
          </div>
        </section>

        {/* CHAPTER 2 */}
        <section id="chapter-2" ref={chapter2Ref} style={sectionStyle}>
          <div style={{ ...cardStyle, maxWidth: '750px' }}>
            <span style={badgeStyle}>Chapter 2</span>
            <h2 style={titleStyle}>Growth</h2>
            <p style={descriptionStyle}>
              Education is the ladder. In {winner.name}, the rungs available to you are shaped by national infrastructure, 
              not just individual effort.
            </p>
            <Chapter2Chart countryData={winner} countriesData={COUNTRIES} />
          </div>
        </section>

        {/* CHAPTER 3 */}
        <section id="chapter-3" ref={chapter3Ref} style={sectionStyle}>
          <div style={cardStyle}>
            <span style={badgeStyle}>Chapter 3</span>
            <h2 style={titleStyle}>Adulthood</h2>
            <p style={descriptionStyle}>
              The economy you enter dictates the value of your labor. In {winner.name}, your earning potential and quality of life are bound by macroscopic market conditions.
            </p>
            <Chapter3Chart countryData={winner} />
          </div>
        </section>

        {/* CHAPTER 4 */}
        <section id="chapter-4" ref={chapter4Ref} style={sectionStyle}>
          <div style={cardStyle}>
            <span style={badgeStyle}>Chapter 4</span>
            <h2 style={titleStyle}>Final Stage</h2>
            <p style={descriptionStyle}>
              The final metric of the lottery is time. Life expectancy in {winner.name} reflects a lifetime of accumulated healthcare, safety, and systemic conditions.
            </p>
          </div>
        </section>

        {/* CONCLUSION CHART */}
        <section id="conclusion" style={sectionStyle}>
          <FinalComparisonChart winner={winner} />
        </section>
      </div>
    </div>
  );
};

// Reusable Styles to keep the code clean
const sectionStyle: React.CSSProperties = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 0' };
const cardStyle: React.CSSProperties = { maxWidth: '650px', padding: '50px', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', borderRadius: '40px', border: '1px solid #333', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' };
const badgeStyle: React.CSSProperties = { color: '#6366f1', fontSize: '10px', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase' };
const titleStyle: React.CSSProperties = { fontSize: '3.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.02em' };
const descriptionStyle: React.CSSProperties = { color: '#888', lineHeight: 1.7, fontSize: '1.1rem', marginBottom: '30px' };

export default SimulatorSection;