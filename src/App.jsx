import { useState } from 'react';
import { useTournamentState } from './useTournamentState';
import './App.css';
import GroupStage from './components/GroupStage';
import Knockouts from './components/Knockouts';
import Teams from './components/Teams';
import Widget from './components/Widget';
import WidgetBrackets from './components/WidgetBrackets';
import TVView from './components/TVView';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('equipos');
  const [copiedLink, setCopiedLink] = useState(false);
  const { groups, updatePlayer, autoFillTestData, bracketScores, updateBracketScore, loading } = useTournamentState();

  const obsMode = new URLSearchParams(window.location.search).get('obs');

  const copyObsLink = () => {
    const link = `${window.location.origin}/?obs=true`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const copyObsBracketsLink = () => {
    const link = `${window.location.origin}/?obs=brackets`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (obsMode === 'true') {
    return (
      <div className="App" style={{ background: 'transparent' }}>
        {loading ? null : <Widget groups={groups} />}
      </div>
    );
  }

  if (obsMode === 'brackets') {
    return (
      <div className="App" style={{ background: 'transparent' }}>
        {loading ? null : <WidgetBrackets groups={groups} bracketScores={bracketScores} />}
      </div>
    );
  }

  if (obsMode === 'tv') {
    return (
      <div className="App" style={{ background: 'transparent' }}>
        {loading ? null : <TVView groups={groups} bracketScores={bracketScores} />}
      </div>
    );
  }

  return (
    <div className="App">
      <header className="header">
        <div className="header-container">
          <img src="/logo_mundial.png" alt="Mundial de Play" className="logo-img" style={{ height: '40px', objectFit: 'contain' }} />
          <nav className="nav-links">
            <span 
              className={`nav-link ${activeTab === 'grupos' ? 'active' : ''}`}
              onClick={() => setActiveTab('grupos')}
            >
              Fase de Grupos
            </span>
            <span 
              className={`nav-link ${activeTab === 'eliminatorias' ? 'active' : ''}`}
              onClick={() => setActiveTab('eliminatorias')}
            >
              Eliminatorias
            </span>
            <span 
              className={`nav-link ${activeTab === 'equipos' ? 'active' : ''}`}
              onClick={() => setActiveTab('equipos')}
            >
              Equipos
            </span>
          </nav>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={copyObsLink}
              style={{ 
                background: 'transparent', border: '1px solid var(--primary)', 
                color: 'var(--primary)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
                fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              {copiedLink ? '¡Copiado!' : '🔗 Enlace Grupos OBS'}
            </button>
            <button 
              onClick={copyObsBracketsLink}
              style={{ 
                background: 'transparent', border: '1px solid var(--secondary)', 
                color: 'var(--secondary)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
                fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              {copiedLink ? '¡Copiado!' : '🏆 Enlace Llaves OBS'}
            </button>
            <button 
              onClick={() => window.open('/?obs=tv', '_blank')}
              style={{ 
                background: 'var(--primary)', border: 'none', 
                color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
                fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              📺 Abrir Pantalla Gigante
            </button>
            <div style={{ marginLeft: '8px' }}>
              {loading ? <span className="text-primary" style={{ fontWeight: 'bold' }}>Sincronizando... 🔄</span> : <span className="text-primary" style={{ fontWeight: 'bold' }}>En línea 🟢</span>}
            </div>
          </div>
        </div>
      </header>

      <main className="main-content container">
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--on-surface-variant)' }}>
             <h2>Descargando datos del torneo...</h2>
          </div>
        ) : (
          <>
            {activeTab === 'grupos' && <GroupStage groups={groups} updatePlayer={updatePlayer} />}
            {activeTab === 'eliminatorias' && <Knockouts groups={groups} bracketScores={bracketScores} updateBracketScore={updateBracketScore} />}
            {activeTab === 'equipos' && <Teams groups={groups} updatePlayer={updatePlayer} autoFillTestData={autoFillTestData} />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
