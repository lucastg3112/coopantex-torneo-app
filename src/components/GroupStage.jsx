import React, { useState } from 'react';
import { CountryText } from './CountryText';

export default function GroupStage({ groups, updatePlayer }) {
  const [activePhase, setActivePhase] = useState('A');
  const groupKeys = Object.keys(groups).filter(k => k.startsWith(activePhase));

  const sortPlayers = (players) => {
    return [...players].sort((a, b) => b.points - a.points || b.gd - a.gd);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ minWidth: '300px' }}>
          <p className="text-sm text-primary">TEMPORADA 2024</p>
          <h1>TABLAS DE CLASIFICACIÓN</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setActivePhase('A')}
            style={{ padding: '8px 16px', borderRadius: 'var(--rounded-sm)', background: activePhase === 'A' ? 'var(--surface-container-lowest)' : 'var(--surface-container-high)', border: activePhase === 'A' ? '1px solid var(--primary)' : 'none', color: activePhase === 'A' ? 'var(--primary)' : 'var(--on-surface)' }}>
            FASE A
          </button>
          <button 
            onClick={() => setActivePhase('B')}
            style={{ padding: '8px 16px', borderRadius: 'var(--rounded-sm)', background: activePhase === 'B' ? 'var(--surface-container-lowest)' : 'var(--surface-container-high)', border: activePhase === 'B' ? '1px solid var(--primary)' : 'none', color: activePhase === 'B' ? 'var(--primary)' : 'var(--on-surface)' }}>
            FASE B
          </button>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {groupKeys.map((groupId) => {
          const sortedPlayers = sortPlayers(groups[groupId]);
          
          return (
            <div key={groupId} style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--surface-container-high)', borderRadius: 'var(--rounded-lg)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--surface-container-high)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '4px', height: '24px', background: 'var(--primary)' }}></div>
                <h3 style={{ margin: 0 }}>POSICIONES GRUPO {groupId}</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-container)', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-archivo)' }}>
                    <th style={{ padding: '12px 24px', textAlign: 'left', width: '50px' }}>POS</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>JUGADOR</th>
                    <th style={{ padding: '12px' }}>PTS</th>
                    <th style={{ padding: '12px' }}>DIF GOLES</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPlayers.map((player, index) => {
                    const originalIndex = groups[groupId].findIndex(p => p.id === player.id);
                    const isFirst = index === 0;
                    
                    return (
                      <tr key={player.id} style={{ borderBottom: '1px solid var(--surface-container-high)', background: index % 2 === 0 ? 'var(--surface-container-lowest)' : 'var(--surface-container-low)' }}>
                        <td style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 'bold', color: isFirst ? 'var(--primary)' : 'var(--on-surface)' }}>
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td style={{ padding: '16px 12px', textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: '500', color: 'black' }}>{player.name || 'Sin nombre'}</span>
                              <CountryText countryName={player.team} />
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px 12px', fontWeight: 'bold', color: isFirst ? 'var(--primary)' : 'var(--on-surface)' }}>
                           <input type="number" value={player.points} onChange={(e) => updatePlayer(groupId, originalIndex, 'points', parseInt(e.target.value) || 0)} style={{ width: '50px', textAlign: 'center', padding: '4px', border: '1px solid var(--surface-variant)' }} />
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                           <input type="number" value={player.gd} onChange={(e) => updatePlayer(groupId, originalIndex, 'gd', parseInt(e.target.value) || 0)} style={{ width: '50px', textAlign: 'center', padding: '4px', border: '1px solid var(--surface-variant)', borderRadius: 'var(--rounded-sm)', fontWeight: 'bold' }} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
