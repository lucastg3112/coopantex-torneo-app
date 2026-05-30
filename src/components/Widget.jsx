import React, { useState, useEffect } from 'react';
import { CountryText } from './CountryText';

export default function Widget({ groups }) {
  const groupKeys = Object.keys(groups);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');

  useEffect(() => {
    // Forzar fondo transparente en el body para OBS
    document.body.style.background = 'transparent';
    return () => {
      document.body.style.background = ''; // limpiar al desmontar
    };
  }, []);

  useEffect(() => {
    if (groupKeys.length === 0) return;

    const interval = setInterval(() => {
      setFadeState('fade-out');
      
      // Esperar a que la animación de salida termine antes de cambiar los datos
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % groupKeys.length);
        setFadeState('fade-in');
      }, 500); // 500ms fade out
    }, 10000); // 10s total (9.5s visible, 0.5s out)

    return () => clearInterval(interval);
  }, [groupKeys.length]);

  if (groupKeys.length === 0) return null;

  const currentGroupId = groupKeys[currentIndex];
  const groupPlayers = [...groups[currentGroupId]].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.gd - a.gd;
  });

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      overflow: 'hidden',
      color: 'white',
      fontFamily: 'var(--font-inter, sans-serif)'
    }}>
      <div 
        style={{
          width: '500px',
          background: 'var(--surface)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          border: '1px solid var(--surface-variant)',
          transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-out',
          opacity: fadeState === 'fade-in' ? 1 : 0,
          transform: fadeState === 'fade-in' ? 'translateY(0)' : 'translateY(20px)'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary)', fontSize: '28px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900' }}>
          Grupo {currentGroupId}
        </h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--surface-variant)', color: 'var(--on-surface-variant)', fontSize: '14px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px', textAlign: 'center' }}>Pos</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Jugador</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>DG</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Pts</th>
            </tr>
          </thead>
          <tbody>
            {groupPlayers.map((player, idx) => (
              <tr key={player.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', backgroundColor: idx === 0 ? 'var(--surface-container-high)' : 'transparent' }}>
                <td style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', fontSize: '18px', color: idx === 0 ? 'var(--primary)' : '#000' }}>
                  {idx + 1}
                </td>
                <td style={{ padding: '16px 12px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#000' }}>{player.name || '---'}</span>
                    <CountryText countryName={player.team} />
                  </div>
                </td>
                <td style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '500', fontSize: '16px', color: '#000' }}>{player.gd}</td>
                <td style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px', color: 'var(--primary)' }}>{player.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
