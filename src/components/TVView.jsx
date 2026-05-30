import React, { useState, useEffect } from 'react';
import { CountryText } from './CountryText';
import { getQualifiedFromPhase, getWinner } from './Knockouts';

// Componente para mostrar una tabla de grupo compacta
const MiniGroupTable = ({ groupId, players }) => {
  const sorted = [...players].sort((a, b) => b.points - a.points || b.gd - a.gd);
  return (
    <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--surface-variant)', width: '380px' }}>
      <h3 style={{ color: 'var(--primary)', textAlign: 'center', marginBottom: '12px', textTransform: 'uppercase' }}>Grupo {groupId}</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--surface-variant)', color: 'var(--on-surface-variant)' }}>
            <th style={{ padding: '6px' }}>Pos</th>
            <th style={{ padding: '6px', textAlign: 'left' }}>Jugador</th>
            <th style={{ padding: '6px' }}>DG</th>
            <th style={{ padding: '6px' }}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, idx) => (
            <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: idx === 0 ? 'rgba(165,180,252,0.1)' : 'transparent' }}>
              <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', color: idx === 0 ? 'var(--primary)' : 'black' }}>{idx + 1}</td>
              <td style={{ padding: '8px', textAlign: 'left', fontWeight: 'bold', color: 'black' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{p.name || '--'}</span>
                  <CountryText countryName={p.team} />
                </div>
              </td>
              <td style={{ padding: '8px', textAlign: 'center', color: 'black' }}>{p.gd}</td>
              <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>{p.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Componente para estadísticas
const StatsView = ({ groups }) => {
  const allPlayers = Object.values(groups).flat();
  const topPoints = [...allPlayers].sort((a, b) => b.points - a.points || b.gd - a.gd).slice(0, 5);
  const topScorers = [...allPlayers].sort((a, b) => b.gd - a.gd || b.points - a.points).slice(0, 5);

  return (
    <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--surface-variant)', width: '450px' }}>
        <h2 style={{ color: 'var(--primary)', textAlign: 'center', marginBottom: '24px', fontSize: '28px' }}>🔥 MÁS PUNTOS (INVICTOS)</h2>
        {topPoints.map((p, idx) => (
          <div key={`pts-${p.id}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', fontWeight: '900', color: idx === 0 ? 'gold' : 'var(--on-surface-variant)' }}>#{idx+1}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'black' }}>{p.name}</span>
                <CountryText countryName={p.team} />
              </div>
            </div>
            <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary)' }}>{p.points} Pts</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--surface-variant)', width: '450px' }}>
        <h2 style={{ color: 'var(--secondary)', textAlign: 'center', marginBottom: '24px', fontSize: '28px' }}>⚽ MEJOR DIFERENCIA G.</h2>
        {topScorers.map((p, idx) => (
          <div key={`gd-${p.id}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', fontWeight: '900', color: idx === 0 ? 'gold' : 'var(--on-surface-variant)' }}>#{idx+1}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'black' }}>{p.name}</span>
                <CountryText countryName={p.team} />
              </div>
            </div>
            <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--secondary)' }}>+{p.gd}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente principal TVView
export default function TVView({ groups, bracketScores }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [fade, setFade] = useState('fade-in');

  useEffect(() => {
    document.body.style.background = 'radial-gradient(circle at center, #1e293b, #0f172a, #000000)';
    return () => { document.body.style.background = ''; };
  }, []);

  const groupKeys = groups ? Object.keys(groups) : [];
  if (groupKeys.length === 0) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a', color: 'white' }}>
        <h2 style={{ fontSize: '24px' }}>Cargando datos del torneo...</h2>
      </div>
    );
  }

  const slides = [
    {
      id: 'stats',
      title: 'ESTADÍSTICAS GLOBALES DEL TORNEO',
      content: <StatsView groups={groups} />
    },
    {
      id: 'groups-a1-a4',
      title: 'POSICIONES - FASE A (TANDA 1)',
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', maxWidth: '900px' }}>
          {['A1','A2','A3','A4'].map(k => groups[k] && <MiniGroupTable key={k} groupId={k} players={groups[k]} />)}
        </div>
      )
    },
    {
      id: 'groups-a5-a7',
      title: 'POSICIONES - FASE A (TANDA 1)',
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', maxWidth: '900px' }}>
          {['A5','A6','A7'].map(k => groups[k] && <MiniGroupTable key={k} groupId={k} players={groups[k]} />)}
        </div>
      )
    },
    {
      id: 'groups-b1-b4',
      title: 'POSICIONES - FASE B (TANDA 2)',
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', maxWidth: '900px' }}>
          {['B1','B2','B3','B4'].map(k => groups[k] && <MiniGroupTable key={k} groupId={k} players={groups[k]} />)}
        </div>
      )
    },
    {
      id: 'groups-b5-b7',
      title: 'POSICIONES - FASE B (TANDA 2)',
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', maxWidth: '900px' }}>
          {['B5','B6','B7'].map(k => groups[k] && <MiniGroupTable key={k} groupId={k} players={groups[k]} />)}
        </div>
      )
    }
  ];

  // Omitimos la lógica del Bracket aquí para mantener el archivo limpio.
  // El usuario puede usar la pantalla de Bracket para ver las eliminatorias o podemos incluirlo si lo pide,
  // pero ya le dimos el enlace dedicado de Brackets en OBS que puede usar si quiere en la TV.
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFade('fade-out');
      setTimeout(() => {
        setSlideIndex(prev => (prev + 1) % slides.length);
        setFade('fade-in');
      }, 500);
    }, 12000); // 12 segundos
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', color: 'white', fontFamily: 'var(--font-inter)' }}>
      {/* HEADER TV */}
      <div style={{ padding: '24px 48px', background: 'white', borderBottom: '4px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <img src="/logo_mundial.png" alt="Coopantex Logo" style={{ height: '80px', objectFit: 'contain' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '900', fontSize: '36px', letterSpacing: '2px', color: 'var(--primary)' }}>MUNDIAL DE PLAY</span>
            <span style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '4px', color: '#666' }}>COOPANTEX</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', background: 'var(--primary)', padding: '12px 24px', borderRadius: '12px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{slides[slideIndex].title}</div>
        </div>
      </div>

      {/* CONTENT CAROUSEL */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', overflow: 'hidden' }}>
        <div 
          style={{
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            opacity: fade === 'fade-in' ? 1 : 0,
            transform: fade === 'fade-in' ? 'scale(1)' : 'scale(0.95)',
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {slides[slideIndex].content}
        </div>
      </div>
    </div>
  );
}
