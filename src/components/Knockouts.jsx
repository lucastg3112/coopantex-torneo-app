import React from 'react';
import { CountryText } from './CountryText';

export const getQualifiedFromPhase = (groups, phaseStr) => {
  const phaseGroups = Object.keys(groups).filter(k => k.startsWith(phaseStr));
  let firstPlaces = [];
  let secondPlaces = [];

  phaseGroups.forEach(groupId => {
    const sorted = [...groups[groupId]].sort((a, b) => b.points - a.points || b.gd - a.gd);
    if(sorted[0]) firstPlaces.push({ ...sorted[0], group: groupId, isFirst: true });
    if(sorted[1]) secondPlaces.push({ ...sorted[1], group: groupId, isFirst: false });
  });

  secondPlaces.sort((a, b) => b.points - a.points || b.gd - a.gd);
  const bestSecond = secondPlaces[0];

  let qualified = [...firstPlaces];
  if (bestSecond) {
    qualified.push(bestSecond);
  }
  return qualified;
};

export const getWinner = (team1, team2, matchId, bracketScores) => {
  const match = bracketScores[matchId];
  if (!match || !match.winner) return null;
  return match.winner === 1 ? team1 : team2;
};

const MatchNode = ({ team1, team2, roundName, matchId, bracketScores, updateBracketScore }) => {
  const matchData = bracketScores[matchId] || { s1: '', s2: '', winner: null };
  const isWinner1 = matchData.winner === 1;
  const isWinner2 = matchData.winner === 2;
  
  return (
    <div style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--surface-container-high)', borderRadius: 'var(--rounded-lg)', width: '220px', overflow: 'hidden', position: 'relative' }}>
      <div style={{ padding: '6px 12px', background: 'var(--surface-container-low)', borderBottom: '1px solid var(--surface-container-high)', fontSize: '10px', fontWeight: 'bold', color: 'var(--on-surface-variant)', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
        <span>{roundName}</span>
        {/* Botón en caso de empate para forzar ganador (simulando penales) */}
        {(matchData.s1 !== '' && matchData.s1 === matchData.s2 && !matchData.winner) && (
          <span style={{ color: 'var(--primary)' }}>Desempate ⚔️</span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid var(--surface-container-high)', background: isWinner1 ? 'var(--surface-container)' : 'transparent' }}>
        <div style={{ display: 'flex', flexDirection: 'column', opacity: team1 ? 1 : 0.4, maxWidth: '130px', justifyContent: 'center' }}>
          <CountryText countryName={team1?.team} />
          <span style={{ fontWeight: isWinner1 ? 'bold' : 'normal', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{team1?.name || 'Por definir'}</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
           {(matchData.s1 === matchData.s2 && matchData.s1 !== '' && team1) && (
             <button onClick={() => updateBracketScore(matchId, 'manualWinner', 1)} style={{ padding: '2px 4px', fontSize: '10px', cursor: 'pointer' }}>G</button>
           )}
           <input type="number" min="0" value={matchData.s1} onChange={(e) => {
             const val = Math.max(0, parseInt(e.target.value) || 0);
             updateBracketScore(matchId, 's1', e.target.value === '' ? '' : val);
           }} disabled={!team1 || !team2} style={{ width: '36px', textAlign: 'center', border: '1px solid var(--surface-variant)', borderRadius: 'var(--rounded-sm)', fontWeight: 'bold' }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: isWinner2 ? 'var(--surface-container)' : 'transparent' }}>
        <div style={{ display: 'flex', flexDirection: 'column', opacity: team2 ? 1 : 0.4, maxWidth: '130px', justifyContent: 'center' }}>
          <CountryText countryName={team2?.team} />
          <span style={{ fontWeight: isWinner2 ? 'bold' : 'normal', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{team2?.name || 'Por definir'}</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
           {(matchData.s1 === matchData.s2 && matchData.s1 !== '' && team2) && (
             <button onClick={() => updateBracketScore(matchId, 'manualWinner', 2)} style={{ padding: '2px 4px', fontSize: '10px', cursor: 'pointer' }}>G</button>
           )}
           <input type="number" min="0" value={matchData.s2} onChange={(e) => {
             const val = Math.max(0, parseInt(e.target.value) || 0);
             updateBracketScore(matchId, 's2', e.target.value === '' ? '' : val);
           }} disabled={!team1 || !team2} style={{ width: '36px', textAlign: 'center', border: '1px solid var(--surface-variant)', borderRadius: 'var(--rounded-sm)', fontWeight: 'bold' }} />
        </div>
      </div>
    </div>
  );
};

const PhaseBracket = ({ phaseName, qualified, primaryColor, bracketScores, updateBracketScore }) => {
  const r1m1 = [qualified[0], qualified[7]];
  const r1m2 = [qualified[1], qualified[6]];
  const r1m3 = [qualified[2], qualified[5]];
  const r1m4 = [qualified[3], qualified[4]];

  const r2m1 = [
    getWinner(r1m1[0], r1m1[1], `${phaseName}-R1-1`, bracketScores),
    getWinner(r1m2[0], r1m2[1], `${phaseName}-R1-2`, bracketScores)
  ];
  
  const r2m2 = [
    getWinner(r1m3[0], r1m3[1], `${phaseName}-R1-3`, bracketScores),
    getWinner(r1m4[0], r1m4[1], `${phaseName}-R1-4`, bracketScores)
  ];

  const r3m1 = [
    getWinner(r2m1[0], r2m1[1], `${phaseName}-R2-1`, bracketScores),
    getWinner(r2m2[0], r2m2[1], `${phaseName}-R2-2`, bracketScores)
  ];

  return (
    <div style={{ marginBottom: '48px', padding: '24px', border: `1px solid ${primaryColor}`, borderRadius: 'var(--rounded-lg)', background: 'var(--surface-bright)' }}>
      <h2 style={{ color: primaryColor, marginBottom: '24px' }}>ELIMINATORIAS FASE {phaseName}</h2>
      <div style={{ display: 'flex', overflowX: 'auto', gap: '48px', paddingBottom: '16px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: 'var(--on-surface-variant)', fontSize: '14px', marginBottom: '8px', textAlign: 'center' }}>OCTAVOS (R1)</h4>
          <MatchNode team1={r1m1[0]} team2={r1m1[1]} roundName={`MATCH 1`} matchId={`${phaseName}-R1-1`} bracketScores={bracketScores} updateBracketScore={updateBracketScore} />
          <MatchNode team1={r1m2[0]} team2={r1m2[1]} roundName={`MATCH 2`} matchId={`${phaseName}-R1-2`} bracketScores={bracketScores} updateBracketScore={updateBracketScore} />
          <MatchNode team1={r1m3[0]} team2={r1m3[1]} roundName={`MATCH 3`} matchId={`${phaseName}-R1-3`} bracketScores={bracketScores} updateBracketScore={updateBracketScore} />
          <MatchNode team1={r1m4[0]} team2={r1m4[1]} roundName={`MATCH 4`} matchId={`${phaseName}-R1-4`} bracketScores={bracketScores} updateBracketScore={updateBracketScore} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: '16px' }}>
          <h4 style={{ color: 'var(--on-surface-variant)', fontSize: '14px', marginBottom: '8px', textAlign: 'center' }}>CUARTOS (R2)</h4>
          <MatchNode team1={r2m1[0]} team2={r2m1[1]} roundName={`SEMI 1`} matchId={`${phaseName}-R2-1`} bracketScores={bracketScores} updateBracketScore={updateBracketScore} />
          <MatchNode team1={r2m2[0]} team2={r2m2[1]} roundName={`SEMI 2`} matchId={`${phaseName}-R2-2`} bracketScores={bracketScores} updateBracketScore={updateBracketScore} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: '16px' }}>
          <h4 style={{ color: 'var(--on-surface-variant)', fontSize: '14px', marginBottom: '8px', textAlign: 'center' }}>FINAL FASE {phaseName}</h4>
          <MatchNode team1={r3m1[0]} team2={r3m1[1]} roundName={`FINAL FASE`} matchId={`${phaseName}-R3-1`} bracketScores={bracketScores} updateBracketScore={updateBracketScore} />
        </div>

      </div>
    </div>
  );
};

export default function Knockouts({ groups, bracketScores, updateBracketScore }) {
  const qualifiedA = getQualifiedFromPhase(groups, 'A');
  const qualifiedB = getQualifiedFromPhase(groups, 'B');

  // Ganadores absolutos de cada fase para la Gran Final
  const champA = getWinner(
    getWinner(
      getWinner(qualifiedA[0], qualifiedA[7], 'A-R1-1', bracketScores),
      getWinner(qualifiedA[1], qualifiedA[6], 'A-R1-2', bracketScores), 'A-R2-1', bracketScores
    ),
    getWinner(
      getWinner(qualifiedA[2], qualifiedA[5], 'A-R1-3', bracketScores),
      getWinner(qualifiedA[3], qualifiedA[4], 'A-R1-4', bracketScores), 'A-R2-2', bracketScores
    ), 'A-R3-1', bracketScores
  );

  const champB = getWinner(
    getWinner(
      getWinner(qualifiedB[0], qualifiedB[7], 'B-R1-1', bracketScores),
      getWinner(qualifiedB[1], qualifiedB[6], 'B-R1-2', bracketScores), 'B-R2-1', bracketScores
    ),
    getWinner(
      getWinner(qualifiedB[2], qualifiedB[5], 'B-R1-3', bracketScores),
      getWinner(qualifiedB[3], qualifiedB[4], 'B-R1-4', bracketScores), 'B-R2-2', bracketScores
    ), 'B-R3-1', bracketScores
  );

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <p className="text-sm bg-primary" style={{ display: 'inline-block', padding: '4px 8px', color: 'white', borderRadius: 'var(--rounded-sm)' }}>EN VIVO</p>
        <h1>CUADRO DE ELIMINATORIAS</h1>
        <p style={{ color: 'var(--on-surface-variant)' }}>Escribe los resultados de los partidos. Si hay empate, presiona "G" para elegir al ganador por penales.</p>
      </div>
      
      <PhaseBracket phaseName="A" qualified={qualifiedA} primaryColor="var(--primary)" bracketScores={bracketScores} updateBracketScore={updateBracketScore} />
      <PhaseBracket phaseName="B" qualified={qualifiedB} primaryColor="var(--secondary)" bracketScores={bracketScores} updateBracketScore={updateBracketScore} />

      <div style={{ padding: '32px', textAlign: 'center', background: 'var(--surface-container-lowest)', border: '2px solid var(--primary)', borderRadius: 'var(--rounded-lg)' }}>
        <span style={{ fontSize: '48px' }}>🏆</span>
        <h2 style={{ color: 'var(--primary)', margin: '16px 0' }}>LA GRAN FINAL MUNDIAL DE PLAY</h2>
        <p style={{ marginBottom: '24px', color: 'var(--on-surface-variant)' }}>CAMPEÓN FASE A vs CAMPEÓN FASE B</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <MatchNode team1={champA} team2={champB} roundName="GRAN FINAL" matchId="GRAN-FINAL" bracketScores={bracketScores} updateBracketScore={updateBracketScore} />
        </div>
      </div>

    </div>
  );
}
