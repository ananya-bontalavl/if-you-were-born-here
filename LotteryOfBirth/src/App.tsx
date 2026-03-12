import React, { useState, useEffect, useRef } from 'react';
import { COUNTRIES } from './data/countries';

import LifeLedger from './components/LifeLedger';
import LotterySpinning from './components/LotterySpinning';
import GlobeSpinning from './components/GlobeSpinning';
import SimulatorSection from './components/SimulatorSection';

const App: React.FC = () => {
  const [stage, setStage] = useState<'welcome' | 'spinning' | 'reveal' | 'simulator'>('welcome');
  const [rotation, setRotation] = useState(0);
  
  const [winner, setWinner] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  
  
  const [activeChapter, setActiveChapter] = useState(0);

  const globeRef = useRef<any>(null);

  useEffect(() => {
    if (stage === 'reveal' && globeRef.current && winner) {
      globeRef.current.pointOfView(
        { lat: winner.lat, lng: winner.lng, altitude: 1.2 },
        2500
      );
    }
  }, [stage, winner]);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setStage('spinning');

    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const randomDegree = Math.floor(Math.random() * 360);
    const newRotation = rotation + (extraSpins * 360) + randomDegree;

    setRotation(newRotation);

    setTimeout(() => {
      const actualRotation = newRotation % 360;
      const adjustedRotation = (actualRotation + 90) % 360;
      const winningAngle = (360 - adjustedRotation) % 360;
      const index = Math.floor(winningAngle / 18);

      setWinner(COUNTRIES[index]);
      setStage('reveal');
      setIsSpinning(false);
    }, 4000);
  };

  return (
    <div
      style={{
        width: '100vw', minHeight: '100vh', backgroundColor: '#000', color: '#fff',
        display: stage === 'simulator' ? 'block' : 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden', position: 'relative'
      }}
    >
      {/* Pass activeChapter to Ledger */}
      {(stage === 'reveal' || stage === 'simulator') && winner && (
        <LifeLedger 
          // country={winner.name} 
          // color={winner.color} 
          // category={winner.cat || "Income Tier"} 
          // activeChapter={activeChapter} 
          winner={winner} 
          activeChapter={activeChapter}
        />
      )}

      {/* Hide the spinning component if we are in simulator stage */}
      {stage !== 'simulator' && (
        <LotterySpinning
          stage={stage}
          rotation={rotation}
          setStage={setStage}
          handleSpin={handleSpin}
          // COUNTRIES={COUNTRIES}
        />
      )}

      {stage === 'reveal' && winner && (
        <GlobeSpinning
          winner={winner}
          globeRef={globeRef}
          setStage={setStage}
        />
      )}

      {/* Pass setActiveChapter to Simulator */}
      {stage === 'simulator' && winner && (
        <SimulatorSection winner={winner} setActiveChapter={setActiveChapter} />
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        ::-webkit-scrollbar { width: 0; background: transparent; }
      `}</style>

      {stage !== 'simulator' && (
        <div
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'radial-gradient(circle at center, rgba(99,102,241,0.1) 0%, #000 90%)', zIndex: -1
          }}
        />
      )}
    </div>
  );
};

export default App;