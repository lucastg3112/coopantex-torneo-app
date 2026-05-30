import React, { useState, useEffect } from 'react';
import { getQualifiedFromPhase, getWinner } from './Knockouts';
import { CountryText } from './CountryText';

const ObsMatchCard = ({ team1, team2, matchId, bracketScores, label }) => {
  const matchData = bracketScores[matchId] || { s1: '', s2: '', winner: null };
  const t1Score = matchData.s1 !== '' ? matchData.s1 : '-';
  const t2Score = matchData.s2 !== '' ? matchData.s2 : '-';
  const isWinner1 = matchData.winner === 1;
  const isWinner2 = matchData.winner === 2;

  return (
    <div style={{ 
      background: 'var(--surface, #1e1e2e)', 
      padding: '24px', 
      borderRadius: '16px', 
      border: '1px solid var(--surface-variant, #3a3b5c)', 
      width: '450px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      fontFamily: 'var(--font-inter, sans-serif)'
    }}>
       <div style={{ textAlign: 'center', color: 'var(--on-surface-variant, #9ca3af)', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '1px' }}>{label}</div>
       
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '12px', opacity: team1 ? 1 : 0.4 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'black', fontSize: '22px', fontWeight: isWinner1 ? '900' : 'bold' }}>{team1 ? team1.name : 'Por definir'}</span>
            <CountryText countryName={team1?.team} />
          </div>
          <div style={{ color: 'black', fontSize: '32px', fontWeight: '900' }}>{t1Score}</div>
       </div>

       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: team2 ? 1 : 0.4 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'black', fontSize: '22px', fontWeight: isWinner2 ? '900' : 'bold' }}>{team2 ? team2.name : 'Por definir'}</span>
            <CountryText countryName={team2?.team} />
          </div>
          <div style={{ color: 'black', fontSize: '32px', fontWeight: '900' }}>{t2Score}</div>
       </div>
    </div>
  );
};

export default function WidgetBrackets({ groups, bracketScores }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');

  useEffect(() => {
    document.body.style.background = 'transparent';
    return () => { document.body.style.background = ''; };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setSlideIndex((prev) => (prev + 1) % 4);
        setFadeState('fade-in');
      }, 500); 
    }, 10000); 
    return () => clearInterval(interval);
  }, []);

  if (!groups || Object.keys(groups).length === 0) return null;

  const qualifiedA = getQualifiedFromPhase(groups, 'A');
  const qualifiedB = getQualifiedFromPhase(groups, 'B');

  // Resoluciones A
  const a_r1m1 = [qualifiedA[0], qualifiedA[7]];
  const a_r1m2 = [qualifiedA[1], qualifiedA[6]];
  const a_r1m3 = [qualifiedA[2], qualifiedA[5]];
  const a_r1m4 = [qualifiedA[3], qualifiedA[4]];

  const a_r2m1 = [getWinner(a_r1m1[0], a_r1m1[1], 'A-R1-1', bracketScores), getWinner(a_r1m2[0], a_r1m2[1], 'A-R1-2', bracketScores)];
  const a_r2m2 = [getWinner(a_r1m3[0], a_r1m3[1], 'A-R1-3', bracketScores), getWinner(a_r1m4[0], a_r1m4[1], 'A-R1-4', bracketScores)];
  const a_r3m1 = [getWinner(a_r2m1[0], a_r2m1[1], 'A-R2-1', bracketScores), getWinner(a_r2m2[0], a_r2m2[1], 'A-R2-2', bracketScores)];

  // Resoluciones B
  const b_r1m1 = [qualifiedB[0], qualifiedB[7]];
  const b_r1m2 = [qualifiedB[1], qualifiedB[6]];
  const b_r1m3 = [qualifiedB[2], qualifiedB[5]];
  const b_r1m4 = [qualifiedB[3], qualifiedB[4]];

  const b_r2m1 = [getWinner(b_r1m1[0], b_r1m1[1], 'B-R1-1', bracketScores), getWinner(b_r1m2[0], b_r1m2[1], 'B-R1-2', bracketScores)];
  const b_r2m2 = [getWinner(b_r1m3[0], b_r1m3[1], 'B-R1-3', bracketScores), getWinner(b_r1m4[0], b_r1m4[1], 'B-R1-4', bracketScores)];
  const b_r3m1 = [getWinner(b_r2m1[0], b_r2m1[1], 'B-R2-1', bracketScores), getWinner(b_r2m2[0], b_r2m2[1], 'B-R2-2', bracketScores)];

  // Ganadores Fases para Gran Final
  const champA = getWinner(a_r3m1[0], a_r3m1[1], 'A-R3-1', bracketScores);
  const champB = getWinner(b_r3m1[0], b_r3m1[1], 'B-R3-1', bracketScores);

  const slides = [
    {
      title: "OCTAVOS DE FINAL - FASE A",
      matches: [
        { t1: a_r1m1[0], t2: a_r1m1[1], id: 'A-R1-1', label: 'MATCH 1' },
        { t1: a_r1m2[0], t2: a_r1m2[1], id: 'A-R1-2', label: 'MATCH 2' },
        { t1: a_r1m3[0], t2: a_r1m3[1], id: 'A-R1-3', label: 'MATCH 3' },
        { t1: a_r1m4[0], t2: a_r1m4[1], id: 'A-R1-4', label: 'MATCH 4' }
      ]
    },
    {
      title: "OCTAVOS DE FINAL - FASE B",
      matches: [
        { t1: b_r1m1[0], t2: b_r1m1[1], id: 'B-R1-1', label: 'MATCH 1' },
        { t1: b_r1m2[0], t2: b_r1m2[1], id: 'B-R1-2', label: 'MATCH 2' },
        { t1: b_r1m3[0], t2: b_r1m3[1], id: 'B-R1-3', label: 'MATCH 3' },
        { t1: b_r1m4[0], t2: b_r1m4[1], id: 'B-R1-4', label: 'MATCH 4' }
      ]
    },
    {
      title: "CUARTOS DE FINAL",
      matches: [
        { t1: a_r2m1[0], t2: a_r2m1[1], id: 'A-R2-1', label: 'CUARTOS A - SEMI 1' },
        { t1: a_r2m2[0], t2: a_r2m2[1], id: 'A-R2-2', label: 'CUARTOS A - SEMI 2' },
        { t1: b_r2m1[0], t2: b_r2m1[1], id: 'B-R2-1', label: 'CUARTOS B - SEMI 1' },
        { t1: b_r2m2[0], t2: b_r2m2[1], id: 'B-R2-2', label: 'CUARTOS B - SEMI 2' }
      ]
    },
    {
      title: "FINALES",
      matches: [
        { t1: a_r3m1[0], t2: a_r3m1[1], id: 'A-R3-1', label: 'FINAL FASE A (SEMI GENERAL)' },
        { t1: b_r3m1[0], t2: b_r3m1[1], id: 'B-R3-1', label: 'FINAL FASE B (SEMI GENERAL)' },
        { t1: champA, t2: champB, id: 'GRAN-FINAL', label: '🏆 LA GRAN FINAL' }
      ]
    }
  ];

  const currentSlide = slides[slideIndex];

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      overflow: 'hidden'
    }}>
      <div 
        style={{
          transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-out',
          opacity: fadeState === 'fade-in' ? 1 : 0,
          transform: fadeState === 'fade-in' ? 'translateY(0)' : 'translateY(20px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <h1 style={{ 
          fontSize: '48px', 
          color: 'black', 
          textTransform: 'uppercase', 
          letterSpacing: '4px',
          textShadow: '0 2px 10px rgba(255,255,255,0.5)',
          marginBottom: '40px',
          fontWeight: '900',
          background: 'rgba(255,255,255,0.8)',
          padding: '12px 32px',
          borderRadius: '24px',
          border: '2px solid var(--primary)'
        }}>
          {currentSlide.title}
        </h1>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: '32px', 
          maxWidth: '1100px' 
        }}>
          {currentSlide.matches.map((m, idx) => (
            <ObsMatchCard key={idx} team1={m.t1} team2={m.t2} matchId={m.id} bracketScores={bracketScores} label={m.label} />
          ))}
        </div>
      </div>
    </div>
  );
}
