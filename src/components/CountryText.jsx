import React from 'react';

const getCountryColor = (countryName) => {
  const colors = {
    'Alemania': '#333333', 
    'Argentina': '#5FA0D6', 
    'Bélgica': '#D32F2F',
    'Brasil': '#008933',
    'Colombia': '#D4AF37', 
    'Croacia': '#D32F2F',
    'Dinamarca': '#C60C30',
    'España': '#D32F2F',
    'Estados Unidos': '#0A3161',
    'Inglaterra': '#CE1124',
    'Italia': '#0066B2',
    'Marruecos': '#C1272D',
    'México': '#006847',
    'Países Bajos': '#E65100', 
    'Portugal': '#046A38',
    'Senegal': '#00853F',
    'Suiza': '#D32F2F',
    'Uruguay': '#0038A8',
    // Nuevos países del roster
    'Rumania': '#002B7F',
    'Hungria': '#CE2939',
    'Polonia': '#DC143C',
    'Arabia Saudi': '#006C35',
    'Chequia': '#11457E',
    'Suecia': '#004B87',
    'Gales': '#C8102E',
    'Islandia': '#02529C',
    'Finlandia': '#002F6C',
    'Escocia': '#005EB8',
    'Noruega': '#BA0C2F',
    'Irlanda del Norte': '#009E60',
    'Qatar': '#8A1538',
    'Ghana': '#CE1126',
    'Ucrania': '#005BBB',
    'Irlanda': '#169B62'
  };
  return colors[countryName] || 'var(--on-surface-variant)';
};

const normalizeCountryName = (input) => {
  if (!input) return null;
  // Mapeo de legacy codes (las siglas de las banderas)
  const legacyMap = {
    'de': 'Alemania', 'ar': 'Argentina', 'be': 'Bélgica', 'br': 'Brasil',
    'co': 'Colombia', 'hr': 'Croacia', 'dk': 'Dinamarca', 'es': 'España',
    'us': 'Estados Unidos', 'gb-eng': 'Inglaterra', 'it': 'Italia', 
    'ma': 'Marruecos', 'mx': 'México', 'nl': 'Países Bajos', 'pt': 'Portugal',
    'sn': 'Senegal', 'ch': 'Suiza', 'uy': 'Uruguay',
    // Mapeo por si quedaron emojis nativos como strings en DB
    '🇩🇪': 'Alemania', '🇦🇷': 'Argentina', '🇧🇪': 'Bélgica', '🇧🇷': 'Brasil',
    '🇨🇴': 'Colombia', '🇭🇷': 'Croacia', '🇩🇰': 'Dinamarca', '🇪🇸': 'España',
    '🇺🇸': 'Estados Unidos', '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 'Inglaterra', '🇮🇹': 'Italia',
    '🇲🇦': 'Marruecos', '🇲🇽': 'México', '🇳🇱': 'Países Bajos', '🇵🇹': 'Portugal',
    '🇸🇳': 'Senegal', '🇨🇭': 'Suiza', '🇺🇾': 'Uruguay'
  };
  return legacyMap[input] || input;
};

export const CountryText = ({ countryName }) => {
  const normalizedName = normalizeCountryName(countryName);
  
  if (!normalizedName) return <span style={{ fontSize: '10px', color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>SIN PAÍS</span>;
  
  const textColor = getCountryColor(normalizedName);
  
  return (
    <span style={{ 
      fontSize: '11px', 
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: textColor,
      letterSpacing: '0.5px'
    }}>
      {normalizedName}
    </span>
  );
};
