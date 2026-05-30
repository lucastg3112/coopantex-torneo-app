import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const generateEmptyGroups = () => {
  const groups = {};
  ['A', 'B'].forEach((phase) => {
    for (let i = 1; i <= 7; i++) {
      const groupId = `${phase}${i}`;
      groups[groupId] = [
        { id: `${groupId}-1`, name: '', team: '', points: 0, gd: 0 },
        { id: `${groupId}-2`, name: '', team: '', points: 0, gd: 0 },
        { id: `${groupId}-3`, name: '', team: '', points: 0, gd: 0 },
        { id: `${groupId}-4`, name: '', team: '', points: 0, gd: 0 }
      ];
    }
  });
  return groups;
};

export function useTournamentState() {
  const [groups, setGroups] = useState(generateEmptyGroups());
  const [bracketScores, setBracketScores] = useState({});
  const [loading, setLoading] = useState(true);

  // Carga inicial y Suscripción Realtime
  useEffect(() => {
    const fetchInitialData = async () => {
      const { data, error } = await supabase.from('tournament_state').select('*').eq('id', 1).single();
      
      if (error && error.code === 'PGRST116') {
        // Si no existe la fila, intentamos crearla
        const emptyG = generateEmptyGroups();
        const { error: insertErr } = await supabase.from('tournament_state').insert({ id: 1, groups: emptyG, brackets: {} });
        if (insertErr) {
          console.error("Error creating initial state row:", insertErr);
          alert(`Error de conexión con Supabase (Insert): ${insertErr.message}. Verifica las políticas RLS.`);
        } else {
          setGroups(emptyG);
        }
      } else if (error) {
        console.error("Error fetching initial state:", error);
      } else if (data) {
        if (data.groups && Object.keys(data.groups).length > 0) setGroups(data.groups);
        if (data.brackets && Object.keys(data.brackets).length > 0) setBracketScores(data.brackets);
      }
      setLoading(false);
    };
    
    fetchInitialData();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tournament_state', filter: 'id=eq.1' },
        (payload) => {
          const newData = payload.new;
          if (newData.groups) setGroups(newData.groups);
          if (newData.brackets) setBracketScores(newData.brackets);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const syncGroupsToDB = async (newGroups) => {
    try {
      const { error } = await supabase
        .from('tournament_state')
        .update({ groups: newGroups })
        .eq('id', 1);

      if (error) {
        console.error("Error syncing groups to Supabase:", error);
        alert(`Fallo al guardar en Supabase (Update): ${error.message}. Asegúrate de desactivar RLS o dar permisos Anon.`);
      }
    } catch (err) {
      console.error("Error in syncGroupsToDB:", err);
    }
  };

  const syncBracketsToDB = async (newBrackets) => {
    try {
      const { error } = await supabase
        .from('tournament_state')
        .update({ brackets: newBrackets })
        .eq('id', 1);
        
      if (error) {
        console.error("Error syncing brackets to Supabase:", error);
      }
    } catch (err) {
      console.error("Error in syncBracketsToDB:", err);
    }
  };

  const autoFillTestData = () => {
    const officialRoster = {
      'A1': [
        { id: 'A1-1', name: 'David Restrepo', team: 'Alemania', points: 0, gd: 0 },
        { id: 'A1-2', name: 'William Mario', team: 'Estados Unidos', points: 0, gd: 0 },
        { id: 'A1-3', name: 'Angie Gonzalez', team: 'Rumania', points: 0, gd: 0 },
        { id: 'A1-4', name: 'Mario Ballesta', team: 'Hungria', points: 0, gd: 0 }
      ],
      'A2': [
        { id: 'A2-1', name: 'Tomas González', team: 'Argentina', points: 0, gd: 0 },
        { id: 'A2-2', name: 'Pablo Quiroga', team: 'Polonia', points: 0, gd: 0 },
        { id: 'A2-3', name: 'Tomás Hernández', team: 'Arabia Saudi', points: 0, gd: 0 },
        { id: 'A2-4', name: 'Santiago Yepes', team: 'Chequia', points: 0, gd: 0 }
      ],
      'A3': [
        { id: 'A3-1', name: 'Sanier Ramirez', team: 'España', points: 0, gd: 0 },
        { id: 'A3-2', name: 'Luis Castro', team: 'Suecia', points: 0, gd: 0 },
        { id: 'A3-3', name: 'Maicol Aristizábal', team: 'Gales', points: 0, gd: 0 },
        { id: 'A3-4', name: 'Darlin Marin', team: 'Marruecos', points: 0, gd: 0 }
      ],
      'A4': [
        { id: 'A4-1', name: 'Carlos Gallego', team: 'Inglaterra', points: 0, gd: 0 },
        { id: 'A4-2', name: 'Luis Guerra', team: 'Islandia', points: 0, gd: 0 },
        { id: 'A4-3', name: 'Daneliz Caviedez', team: 'Finlandia', points: 0, gd: 0 },
        { id: 'A4-4', name: 'Santiago Zapata', team: 'Escocia', points: 0, gd: 0 }
      ],
      'A5': [
        { id: 'A5-1', name: 'Enrique Montes', team: 'Italia', points: 0, gd: 0 },
        { id: 'A5-2', name: 'Angie Quintero', team: 'Dinamarca', points: 0, gd: 0 },
        { id: 'A5-3', name: 'Sebastián Rivera', team: 'Noruega', points: 0, gd: 0 },
        { id: 'A5-4', name: 'Judy Rua', team: 'Irlanda del Norte', points: 0, gd: 0 }
      ],
      'A6': [
        { id: 'A6-1', name: 'Veronica Lopez', team: 'Países Bajos', points: 0, gd: 0 },
        { id: 'A6-2', name: 'Laura Echeverri', team: 'México', points: 0, gd: 0 },
        { id: 'A6-3', name: 'Alejandro Botero', team: 'Qatar', points: 0, gd: 0 },
        { id: 'A6-4', name: 'Christian Velasquez', team: 'Ghana', points: 0, gd: 0 }
      ],
      'A7': [
        { id: 'A7-1', name: 'Santiago Figueroa', team: 'Portugal', points: 0, gd: 0 },
        { id: 'A7-2', name: 'Jhojan Rua', team: 'Ucrania', points: 0, gd: 0 },
        { id: 'A7-3', name: 'Juan Alvarez', team: 'Croacia', points: 0, gd: 0 },
        { id: 'A7-4', name: 'Heider Rada', team: 'Irlanda', points: 0, gd: 0 }
      ],
      'B1': [
        { id: 'B1-1', name: 'Santiago Montoya', team: 'Alemania', points: 0, gd: 0 },
        { id: 'B1-2', name: 'Esteban Rendon', team: 'Gales', points: 0, gd: 0 },
        { id: 'B1-3', name: 'Juan Diaz', team: 'Irlanda', points: 0, gd: 0 },
        { id: 'B1-4', name: 'Anderson Trujillo', team: 'Hungria', points: 0, gd: 0 }
      ],
      'B2': [
        { id: 'B2-1', name: 'Samuel Marín', team: 'Argentina', points: 0, gd: 0 },
        { id: 'B2-2', name: 'Juan Zuluaga', team: 'Noruega', points: 0, gd: 0 },
        { id: 'B2-3', name: 'Karen LLano', team: 'Escocia', points: 0, gd: 0 },
        { id: 'B2-4', name: 'Yuli Velasquez', team: 'Arabia Saudi', points: 0, gd: 0 }
      ],
      'B3': [
        { id: 'B3-1', name: 'Jonathan Martinez', team: 'España', points: 0, gd: 0 },
        { id: 'B3-2', name: 'Jorge Toro', team: 'Islandia', points: 0, gd: 0 },
        { id: 'B3-3', name: 'Daniel Villa', team: 'Rumania', points: 0, gd: 0 },
        { id: 'B3-4', name: 'Emmanuel Campiño', team: 'Suecia', points: 0, gd: 0 }
      ],
      'B4': [
        { id: 'B4-1', name: 'Fredy Miranda', team: 'Inglaterra', points: 0, gd: 0 },
        { id: 'B4-2', name: 'Andres Ocampo', team: 'Estados Unidos', points: 0, gd: 0 },
        { id: 'B4-3', name: 'Samuel Amaya', team: 'México', points: 0, gd: 0 },
        { id: 'B4-4', name: 'Jordan Patiño', team: 'Croacia', points: 0, gd: 0 }
      ],
      'B5': [
        { id: 'B5-1', name: 'Danny Benavidez', team: 'Italia', points: 0, gd: 0 },
        { id: 'B5-2', name: 'Yadith Almanza', team: 'Ucrania', points: 0, gd: 0 },
        { id: 'B5-3', name: 'Juan Ramirez', team: 'Polonia', points: 0, gd: 0 },
        { id: 'B5-4', name: 'Diego Moncada', team: 'Ghana', points: 0, gd: 0 }
      ],
      'B6': [
        { id: 'B6-1', name: 'Matias Arenas', team: 'Países Bajos', points: 0, gd: 0 },
        { id: 'B6-2', name: 'Edian Hernandez', team: 'Marruecos', points: 0, gd: 0 },
        { id: 'B6-3', name: 'Matias Gonzalez', team: 'Irlanda del Norte', points: 0, gd: 0 },
        { id: 'B6-4', name: 'Jhonatan Restrepo', team: 'Dinamarca', points: 0, gd: 0 }
      ],
      'B7': [
        { id: 'B7-1', name: 'Jhoan Lopez', team: 'Portugal', points: 0, gd: 0 },
        { id: 'B7-2', name: 'Sebastian Moná', team: 'Finlandia', points: 0, gd: 0 },
        { id: 'B7-3', name: 'Juan Sanchez', team: 'Chequia', points: 0, gd: 0 },
        { id: 'B7-4', name: 'Emmanuel Vargas', team: 'Qatar', points: 0, gd: 0 }
      ]
    };

    setGroups(officialRoster);
    syncGroupsToDB(officialRoster);
    
    setBracketScores({});
    syncBracketsToDB({});
  };

  const updatePlayer = (groupId, playerIndex, field, value) => {
    setGroups(prev => {
      const newGroups = { ...prev };
      newGroups[groupId] = [...newGroups[groupId]];
      newGroups[groupId][playerIndex] = {
        ...newGroups[groupId][playerIndex],
        [field]: value
      };
      // Sincronizar en background
      syncGroupsToDB(newGroups);
      return newGroups;
    });
  };

  const updateBracketScore = (matchId, field, value) => {
    setBracketScores(prev => {
      const current = prev[matchId] || { s1: '', s2: '', manualWinner: null };
      const updated = { ...current, [field]: value };
      
      if (field === 's1' || field === 's2') {
        const s1 = parseInt(field === 's1' ? value : updated.s1);
        const s2 = parseInt(field === 's2' ? value : updated.s2);
        
        if (!isNaN(s1) && !isNaN(s2)) {
          if (s1 > s2) updated.winner = 1;
          else if (s2 > s1) updated.winner = 2;
          else updated.winner = updated.manualWinner || null;
        } else {
          updated.winner = null;
        }
      }
      
      if (field === 'manualWinner') {
        updated.winner = value;
        updated.manualWinner = value;
      }

      const newBrackets = { ...prev, [matchId]: updated };
      syncBracketsToDB(newBrackets);
      return newBrackets;
    });
  };

  return { groups, updatePlayer, autoFillTestData, bracketScores, updateBracketScore, loading };
}
