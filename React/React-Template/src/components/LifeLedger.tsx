import React from 'react';
import { MapPin, HeartPulse, GraduationCap, Briefcase, Hourglass } from 'lucide-react';

interface Props {
  winner: any; // We now receive the whole winner object
  activeChapter: number;
}

const LifeLedger = ({ winner, activeChapter }: Props) => {
  // Safe fallbacks in case data is loading
  const mortality = winner?.mortality || 0;
  const survivalRate = (100 - mortality).toFixed(1);
  const gniValue = winner?.gni || winner?.["GNI adjusted with PPP(2000-2023)"] || 0;
  const eduValue = winner?.edu || 0;
  const getEducationLabel = (years: number) => {
    if (years >= 16) return "University";
    if (years >= 12) return "High School";
    if (years >= 8) return "Middle School";
    if (years >= 5) return "Primary School";
    return "Incomplete Primary";
  };

  return (
    <div style={{
      position: 'fixed', top: '30px', right: '30px', zIndex: 1000,
      width: '300px', padding: '24px', borderRadius: '24px',
      backgroundColor: 'rgba(20, 20, 25, 0.75)', backdropFilter: 'blur(20px)',
      border: `1px solid ${winner?.color}50`, boxShadow: `0 10px 40px rgba(0,0,0,0.6)`,
      animation: 'fadeInRight 0.8s ease-out',
      transition: 'all 0.4s ease'
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ padding: '10px', backgroundColor: `${winner?.color}33`, borderRadius: '14px' }}>
          <MapPin size={20} color={winner?.color} />
        </div>
        <div>
          <p style={{ fontSize: '10px', color: '#888', fontWeight: 800, textTransform: 'uppercase', margin: 0, letterSpacing: '0.1em' }}>
            Identity Locked
          </p>
          <p style={{ fontSize: '18px', fontWeight: 900, margin: '2px 0 0 0', color: '#fff', letterSpacing: '-0.02em' }}>
            {winner?.name}
          </p>
          <p style={{ fontSize: '10px', fontWeight: 800, margin: '2px 0 0 0', color: winner?.color, textTransform: 'uppercase' }}>
            {winner?.cat || 'Income Tier'}
          </p>
        </div>
      </div>

      <div style={{ 
        display: 'flex', flexDirection: 'column', gap: '16px', 
        borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px'
      }}>
        
        {/* Chapter 1 Data: Survival */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          opacity: activeChapter > 1 ? 1 : 0.3,
          transform: activeChapter > 1 ? 'translateY(0)' : 'translateY(5px)',
          transition: 'all 0.5s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartPulse size={16} color={activeChapter > 1 ? '#ef4444' : '#555'} />
            <p style={{ fontSize: '11px', color: activeChapter > 1 ? '#ddd' : '#555', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
              Survival (Age 5)
            </p>
          </div>
          <p style={{ fontSize: '12px', fontWeight: 900, margin: 0, color: activeChapter > 1 ? '#ef4444' : '#555' }}>
            {activeChapter > 1 ? `${survivalRate}%` : 'Locked'}
          </p>
        </div>

        {/* Chapter 2 Data: Education */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          opacity: activeChapter > 2 ? 1 : 0.3,
          transform: activeChapter > 2 ? 'translateY(0)' : 'translateY(5px)',
          transition: 'all 0.5s ease 0.1s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={16} color={activeChapter > 2 ? winner?.color : '#555'} />
            <p style={{ fontSize: '11px', color: activeChapter > 2 ? '#ddd' : '#555', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
              Education
            </p>
          </div>
          <p style={{ fontSize: '12px', fontWeight: 900, margin: 0, color: activeChapter > 2 ? winner?.color : '#555' }}>
            {activeChapter > 2 ? getEducationLabel(eduValue) : 'Locked'}
          </p>
        </div>

        {/* CHAPTER 3: Adulthood (Income) */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          opacity: activeChapter > 3 ? 1 : 0.3,
          transform: activeChapter > 3 ? 'translateY(0)' : 'translateY(5px)',
          transition: 'all 0.5s ease 0.1s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={16} color={activeChapter > 3 ? '#eab308' : '#555'} />
            <p style={{ fontSize: '11px', color: activeChapter > 3 ? '#ddd' : '#555', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
              Adulthood (Income)
            </p>
          </div>
          <p style={{ fontSize: '12px', fontWeight: 900, margin: 0, color: activeChapter > 3 ? '#eab308' : '#555' }}>
            {activeChapter > 3 ? `$${Math.round(gniValue).toLocaleString()}` : 'Locked'}
          </p>
        </div>

        {/* CHAPTER 4: Final Stage (Life Expectancy) */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          opacity: activeChapter > 4 ? 1 : 0.3,
          transform: activeChapter > 4 ? 'translateY(0)' : 'translateY(5px)',
          transition: 'all 0.5s ease 0.1s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Hourglass size={16} color={activeChapter > 4 ? '#a855f7' : '#555'} />
            <p style={{ fontSize: '11px', color: activeChapter > 4 ? '#ddd' : '#555', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
              Life Expectancy
            </p>
          </div>
          <p style={{ fontSize: '12px', fontWeight: 900, margin: 0, color: activeChapter > 4 ? '#a855f7' : '#555' }}>
            {activeChapter > 4 ? `${winner?.life || winner?.["Life Expectancy"]} Years` : 'Locked'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LifeLedger;