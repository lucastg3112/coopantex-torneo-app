import React from 'react';

const COUNTRIES = [
  'Alemania', 'Arabia Saudi', 'Argentina', 'Bélgica', 'Brasil', 'Chequia', 'Colombia',
  'Croacia', 'Dinamarca', 'Escocia', 'España', 'Estados Unidos', 'Finlandia',
  'Gales', 'Ghana', 'Hungria', 'Inglaterra', 'Irlanda', 'Irlanda del Norte',
  'Islandia', 'Italia', 'Marruecos', 'México', 'Noruega', 'Países Bajos',
  'Polonia', 'Portugal', 'Qatar', 'Rumania', 'Senegal', 'Suecia', 'Suiza',
  'Ucrania', 'Uruguay'
];

export default function Teams({ groups, updatePlayer, autoFillTestData }) {
  const groupKeys = Object.keys(groups);

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="text-sm text-primary">CONFIGURACIÓN</p>
          <h1>GESTIÓN DE EQUIPOS</h1>
          <p style={{ color: 'var(--on-surface-variant)' }}>
            Ingresa los nombres de los 56 jugadores y sus países/equipos correspondientes. (Recuerda que Francia no está permitida por reglamento).
          </p>
        </div>
        <button onClick={autoFillTestData} style={{ background: 'var(--error)', color: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}>
          Cargar Plantillas Oficiales (¡ATENCIÓN: Borra puntuaciones!)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {groupKeys.map((groupId) => (
          <div key={groupId} style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--surface-container-high)', borderRadius: 'var(--rounded-lg)', padding: '16px' }}>
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--surface-container-high)', paddingBottom: '8px' }}>GRUPO {groupId}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {groups[groupId].map((player, index) => (
                <div key={player.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--on-surface-variant)', width: '20px' }}>{index + 1}.</span>
                  <input
                    type="text"
                    placeholder="Nombre del jugador"
                    value={player.name}
                    onChange={(e) => updatePlayer(groupId, index, 'name', e.target.value)}
                    style={{ flex: 1, padding: '8px', border: '1px solid var(--surface-variant)', borderRadius: 'var(--rounded)', fontFamily: 'var(--font-inter)' }}
                  />
                    <select
                      value={player.team}
                      onChange={(e) => updatePlayer(groupId, index, 'team', e.target.value)}
                      style={{ width: '130px', padding: '8px', border: '1px solid var(--surface-variant)', borderRadius: 'var(--rounded)', fontFamily: 'var(--font-inter)', background: 'white' }}
                    >
                      <option value="">Seleccionar...</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
