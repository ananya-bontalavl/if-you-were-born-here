import React from 'react';

interface Props {
  stage: 'welcome' | 'spinning' | 'reveal' | 'simulator';
  rotation: number;
  setStage: any;
  handleSpin: () => void;
  COUNTRIES: any[];
}

const LotterySpinning = ({ stage, rotation, setStage, handleSpin, COUNTRIES }: Props) => (
  <>
    {(stage === 'welcome' || stage === 'spinning' || stage === 'reveal') && (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        
        {stage === 'welcome' && (
          <div style={{ textAlign: 'center', zIndex: 10, animation: 'fadeIn 1.2s ease-out' }}>
            <h1 style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-0.05em', margin: 0, lineHeight: 0.9 }}>
              THE <span style={{ color: '#6366f1' }}>LOTTERY</span> <br /> OF BIRTH
            </h1>
            <p style={{ color: '#666', marginTop: '1.5rem', fontSize: '1.2rem', fontWeight: 500, letterSpacing: '0.1em' }}>
              EVERY HUMAN LIFE IS A ROLL OF THE DICE
            </p>
            <button 
              onClick={() => setStage('spinning')}
              style={{
                marginTop: '4rem', padding: '1.4rem 4.5rem', fontSize: '1.5rem', fontWeight: 900, 
                backgroundColor: '#fff', color: '#000', borderRadius: '100px',
                border: 'none', cursor: 'pointer', transition: '0.3s transform',
                boxShadow: '0 0 40px rgba(99,102,241,0.4)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ENTER THE VOID
            </button>
          </div>
        )}

        {stage === 'spinning' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.8s' }}>
            <div style={{ position: 'relative', width: '600px', height: '600px' }}>
              <div style={{
                position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)',
                width: 0, height: 0, borderLeft: '20px solid transparent', 
                borderRight: '20px solid transparent', borderTop: '45px solid #fff', zIndex: 100,
                filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.6))'
              }} />
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%', border: '12px solid #1a1a1a',
                position: 'relative', overflow: 'hidden',
                transition: 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)',
                transform: `rotate(${rotation}deg)`,
                background: `conic-gradient(${COUNTRIES.map((c, i) => `${c.color} ${i * 18}deg ${(i + 1) * 18}deg`).join(', ')})`,
                boxShadow: '0 0 100px rgba(99,102,241,0.2)'
              }}>
                {COUNTRIES.map((c, i) => (
                  <React.Fragment key={i}>
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      width: '50%', height: '1px', backgroundColor: 'rgba(0,0,0,0.2)',
                      transformOrigin: 'left center', transform: `rotate(${i * 18}deg)`, zIndex: 5
                    }} />
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      width: '50%', height: '1px', transformOrigin: 'left center',
                      transform: `rotate(${i * 18 + 9}deg)`
                    }}>
                      <span style={{
                        position: 'absolute', right: '25px', top: '-7px',
                        fontSize: '10px', fontWeight: 900, color: '#fff',
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                        textShadow: '0 2px 4px rgba(0,0,0,0.9)', letterSpacing: '0.05em'
                      }}>
                        {c.name}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: '80px', height: '80px', backgroundColor: '#000', borderRadius: '50%',
                  border: '4px solid #fff', zIndex: 40, boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
                }} />
              </div>
            </div>

            {rotation === 0 && (
              <button onClick={handleSpin} style={{
                marginTop: '4rem', padding: '1.2rem 4.5rem', backgroundColor: '#6366f1',
                color: '#fff', borderRadius: '15px', fontWeight: 900, border: 'none', cursor: 'pointer',
                fontSize: '1.3rem', boxShadow: '0 10px 40px rgba(99,102,241,0.4)', letterSpacing: '0.1em'
              }}>
                PULL THE TRIGGER
              </button>
            )}
          </div>
        )}
      </div>
    )}
  </>
);

export default LotterySpinning;