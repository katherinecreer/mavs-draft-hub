import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { playerService } from '../services/playerService';
import type { Player, SeasonLog, ScoutingReport, ScoutRanking, Measurement } from '../services/playerService';
import { AiOutlineInfoCircle, AiOutlinePlus } from 'react-icons/ai';
import GamesPlayed from '../components/gamesPlayed';
import '../styles/playerProfile.css';
import { 
  Breadcrumbs, 
  Link, 
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface InternalNote {
  id: number;
  date: string;
  note: string;
  scoutName: string;
}

// Helper function to combine season logs with the same year and team
const combineSeasonLogs = (logs: SeasonLog[]): SeasonLog[] => {
  const combinedLogsMap = new Map<string, SeasonLog>();
  
  logs.forEach(log => {
    const key = `${log.Season}-${log.Team}`; // Only using Season and Team as the key
    
    if (combinedLogsMap.has(key)) {
      const existingLog = combinedLogsMap.get(key)!;
      
      // Calculate total minutes and games
      const totalGames = existingLog.GP + log.GP;
      const totalMinutes = (existingLog.MP * existingLog.GP + log.MP * log.GP);
      
      // Calculate field goal totals
      const totalFGM = (existingLog.FGM * existingLog.GP + log.FGM * log.GP);
      const totalFGA = (existingLog.FGA * existingLog.GP + log.FGA * log.GP);
      const total3PM = (existingLog['3PM'] * existingLog.GP + log['3PM'] * log.GP);
      const total3PA = (existingLog['3PA'] * existingLog.GP + log['3PA'] * log.GP);
      const totalFTM = (existingLog.FT * existingLog.GP + log.FT * log.GP);
      const totalFTA = (existingLog.FTA * existingLog.GP + log.FTA * log.GP);
      
      // Calculate rebound totals
      const totalTRB = (existingLog.TRB * existingLog.GP + log.TRB * log.GP);
      const totalAST = (existingLog.AST * existingLog.GP + log.AST * log.GP);
      const totalBLK = (existingLog.BLK * existingLog.GP + log.BLK * log.GP);
      const totalSTL = (existingLog.STL * existingLog.GP + log.STL * log.GP);
      const totalPF = (existingLog.PF * existingLog.GP + log.PF * log.GP);
      const totalTOV = (existingLog.TOV * existingLog.GP + log.TOV * log.GP);
      const totalPTS = (existingLog.PTS * existingLog.GP + log.PTS * log.GP);

      const combinedLog: SeasonLog = {
        ...log,
        League: 'Combined', // Mark as combined leagues
        GP: totalGames,
        GS: existingLog.GS + log.GS,
        MP: totalMinutes / totalGames,
        FGM: totalFGM / totalGames,
        FGA: totalFGA / totalGames,
        'FG%': (totalFGM / totalFGA) * 100,
        '3PM': total3PM / totalGames,
        '3PA': total3PA / totalGames,
        '3P%': (total3PM / total3PA) * 100,
        FT: totalFTM / totalGames,
        FTA: totalFTA / totalGames,
        FTP: (totalFTM / totalFTA) * 100,
        TRB: totalTRB / totalGames,
        AST: totalAST / totalGames,
        BLK: totalBLK / totalGames,
        STL: totalSTL / totalGames,
        PF: totalPF / totalGames,
        TOV: totalTOV / totalGames,
        PTS: totalPTS / totalGames,
        w: existingLog.w + log.w,
        l: existingLog.l + log.l
      };
      combinedLogsMap.set(key, combinedLog);
    } else {
      combinedLogsMap.set(key, { ...log });
    }
  });
  
  return Array.from(combinedLogsMap.values());
};

const PlayerProfile = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<SeasonLog[]>([]);
  const [scoutingReports, setScoutingReports] = useState<ScoutingReport[]>([]);
  const [scoutRankings, setScoutRankings] = useState<ScoutRanking | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [internalNotes, setInternalNotes] = useState<InternalNote[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [scoutName, setScoutName] = useState('');
  const [showDraftComparison, setShowDraftComparison] = useState(false);
  const [draftClassAverages, setDraftClassAverages] = useState<SeasonLog | null>(null);
  const [measurements, setMeasurements] = useState<Measurement | undefined>(undefined);
  const [showMeasurements, setShowMeasurements] = useState(false);

  useEffect(() => {
    console.log('Effect triggered with playerId:', playerId);
    
    const fetchPlayerData = async () => {
      if (!playerId) {
        console.log('No player ID provided');
        setError('No player ID provided');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Starting data fetch for player ID:', playerId);
        setLoading(true);
        setError(null);
        
        const id = parseInt(playerId);
        console.log('Parsed player ID:', id);
        
        // Fetch player data first
        console.log('Fetching player data...');
        const playerData = await playerService.getPlayerById(id);
        console.log('Player data received:', playerData);
        
        if (!playerData) {
          console.log('Player not found');
          throw new Error('Player not found');
        }
        
        // Then fetch season logs, scouting reports, and rankings
        console.log('Fetching season logs, scouting reports, and rankings...');
        const [playerStats, reports, rankings] = await Promise.all([
          playerService.getPlayerSeasonLogs(id),
          playerService.getPlayerScoutingReports(id),
          playerService.getPlayerScoutRankings(id)
        ]);

        // Fetch measurements
        const playerMeasurements = await playerService.getPlayerMeasurements(id);

        setPlayer(playerData);
        setStats(combineSeasonLogs(playerStats));
        setScoutingReports(reports);
        setScoutRankings(rankings);
        setMeasurements(playerMeasurements);
        setError(null);
      } catch (err) {
        console.error('Error in fetchPlayerData:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch player data');
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [playerId]);

  useEffect(() => {
    if (showDraftComparison && stats.length > 0) {
      try {
        const lastSeason = Math.max(...stats.map(s => s.Season));
        const averages = playerService.getDraftClassAverages(lastSeason);
        setDraftClassAverages(averages);
      } catch (err) {
        console.error('Error getting draft class averages:', err);
        setDraftClassAverages(null);
      }
    }
  }, [showDraftComparison, stats]);

  const getComparisonClass = (stat: keyof SeasonLog, playerStat: number, avgStat: number): string => {
    if (typeof playerStat !== 'number' || typeof avgStat !== 'number') return '';
    
    // For most stats, higher is better
    let betterIfHigher = true;
    
    // For turnovers and personal fouls, lower is better
    if (stat === 'TOV' || stat === 'PF') {
      betterIfHigher = false;
    }
    
    const difference = ((playerStat - avgStat) / avgStat) * 100;
    const threshold = 10; // 10% difference threshold
    
    if (Math.abs(difference) < threshold) return 'neutral';
    return (betterIfHigher ? difference > 0 : difference < 0) ? 'above-average' : 'below-average';
  };

  console.log('Current state:', { loading, error, player, stats });

  const handleAddNote = () => {
    if (newNote.trim() && scoutName.trim()) {
      const note: InternalNote = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        note: newNote.trim(),
        scoutName: scoutName.trim()
      };
      setInternalNotes(prev => [...prev, note]);
      setNewNote('');
      setScoutName('');
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = (id: number) => {
    setInternalNotes(prev => prev.filter(note => note.id !== id));
  };

  // Add effect to fetch all players
  useEffect(() => {
    const fetchAllPlayers = async () => {
      try {
        const players = playerService.getAllPlayers();
        // Sort players by name for the dropdown
        setAllPlayers(players.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error('Error fetching all players:', err);
      }
    };

    fetchAllPlayers();
  }, []);

  const handlePlayerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPlayerId = event.target.value;
    if (!newPlayerId) {
      navigate('/draft-hub');
    } else {
      navigate(`/player/${newPlayerId}`);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Loading player data...</p>
        <p>Player ID: {playerId}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="error">
        <p>Player not found</p>
        <button className="back-button" onClick={() => navigate('/draft-hub')}>
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="player-profile-container">
      <div className="navigation-header">
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ 
            '& .MuiBreadcrumbs-ol': {
              margin: 0
            }
          }}
        >
          <Link
            underline="hover"
            color="inherit"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
          >
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/draft-hub"
            onClick={(e) => {
              e.preventDefault();
              navigate('/draft-hub');
            }}
          >
            Draft Hub
          </Link>
          <Typography color="text.primary">{player.name}</Typography>
        </Breadcrumbs>

        <div className="player-selector">
          <select 
            value={player?.playerId || ''} 
            onChange={handlePlayerChange}
            className="player-dropdown"
          >
            <option value="">Select a player...</option>
            {allPlayers.map((p) => (
              <option key={p.playerId} value={p.playerId}>
                {p.name} - {p.currentTeam}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-left-column">
          <div className="player-header">
            <div className="player-image">
              {player.photoUrl ? (
                <img src={player.photoUrl} alt={player.name} />
              ) : (
                <div className="no-image">No Image Available</div>
              )}
            </div>
            <div className="player-basic-info">
              <h1>{player.name}</h1>
              <p><strong>Current Team:</strong> {player.currentTeam} ({player.league})</p>
              <p><strong>Height/Weight:</strong> {Math.floor(player.height / 12)}'{player.height % 12}" / {player.weight} lbs</p>
              <p><strong>Birth Date:</strong> {new Date(player.birthDate).toLocaleDateString()}</p>
              <p><strong>Nationality:</strong> {player.nationality}</p>
              <p><strong>Hometown:</strong> {player.homeTown}, {player.homeState || player.homeCountry}</p>
              {player.highSchool && (
                <p><strong>High School:</strong> {player.highSchool}, {player.highSchoolState}</p>
              )}
              <button 
                className="back-button"
                onClick={() => setShowMeasurements(true)}
                style={{ 
                  padding: '0.75rem',
                  minWidth: '34px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '0.5rem',
                  marginLeft: '-15rem',
                  scale: '0.75'
                }} 
              >
                <AiOutlinePlus size={16} /> Advanced Measurements
              </button>
              {/* Measurements Modal */}
              {showMeasurements && measurements && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h2>Advanced Measurements for {player.name}</h2>
                      <button onClick={() => setShowMeasurements(false)} className="close-button">×</button>
                    </div>
                    <div className="measurements-grid">
                      <div className="measurement-item">
                        <span className="label">Height (No Shoes)</span>
                        <span className="value">
                          {measurements.heightNoShoes ? 
                            `${Math.floor(measurements.heightNoShoes / 12)}'${(measurements.heightNoShoes % 12).toFixed(2)}"` : 
                            'N/A'}
                        </span>
                      </div>
                      <div className="measurement-item">
                        <span className="label">Wingspan</span>
                        <span className="value">
                          {measurements.wingspan ? 
                            `${Math.floor(measurements.wingspan / 12)}'${(measurements.wingspan % 12).toFixed(2)}"` : 
                            'N/A'}
                        </span>
                      </div>
                      <div className="measurement-item">
                        <span className="label">Standing Reach</span>
                        <span className="value">
                          {measurements.reach ? 
                            `${Math.floor(measurements.reach / 12)}'${(measurements.reach % 12).toFixed(2)}"` : 
                            'N/A'}
                        </span>
                      </div>
                      <div className="measurement-item">
                        <span className="label">Max Vertical</span>
                        <span className="value">{measurements.maxVertical?.toFixed(1) ?? 'N/A'}"</span>
                      </div>
                      <div className="measurement-item">
                        <span className="label">No Step Vertical</span>
                        <span className="value">{measurements.noStepVertical?.toFixed(1) ?? 'N/A'}"</span>
                      </div>
                      <div className="measurement-item">
                        <span className="label">Weight</span>
                        <span className="value">{measurements.weight ?? 'N/A'} lbs</span>
                      </div>
                      <div className="measurement-item">
                        <span className="label">Body Fat</span>
                        <span className="value">{measurements.bodyFat ? `${measurements.bodyFat.toFixed(1)}%` : 'N/A'}</span>
                      </div>
                      <div className="measurement-item">
                        <span className="label">Hand Length</span>
                        <span className="value">{measurements.handLength?.toFixed(2) ?? 'N/A'}"</span>
                      </div>
                      <div className="measurement-item">
                        <span className="label">Hand Width</span>
                        <span className="value">{measurements.handWidth?.toFixed(2) ?? 'N/A'}"</span>
                      </div>
                      <div className="measurement-item">
                        <span className="label">Lane Agility</span>
                        <span className="value">{measurements.agility?.toFixed(2) ?? 'N/A'} sec</span>
                      </div>
                      <div className="measurement-item">
                        <span className="label">Sprint</span>
                        <span className="value">{measurements.sprint?.toFixed(2) ?? 'N/A'} sec</span>
                      </div>
                      <div className="measurement-item">
                        <span className="label">Shuttle (Best)</span>
                        <span className="value">{measurements.shuttleBest?.toFixed(2) ?? 'N/A'} sec</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="player-stats">
            <div className="stats-card" style={{
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="stats-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                padding: '0 0.5rem'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  margin: 0
                }}>{player.name.split(' ').slice(-1)[0]}'s Career Statistics</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button 
                    onClick={() => setShowDraftComparison(!showDraftComparison)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#1e3a8a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      transition: 'background-color 0.2s',
                      whiteSpace: 'nowrap',
                      minWidth: '100px'
                    }}
                  >
                    {showDraftComparison ? 'Hide Comparison' : 'Compare to Draft Class'}
                  </button>
                </div>
              </div>
              <div className="stats-table-container">
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th className="stats-table-header">STATS</th>
                      <th className="stats-table-header">GP</th>
                      <th className="stats-table-header">MIN</th>
                      <th className="stats-table-header">FG%</th>
                      <th className="stats-table-header">3P%</th>
                      <th className="stats-table-header">FT%</th>
                      <th className="stats-table-header">REB</th>
                      <th className="stats-table-header">AST</th>
                      <th className="stats-table-header">BLK</th>
                      <th className="stats-table-header">STL</th>
                      <th className="stats-table-header">PF</th>
                      <th className="stats-table-header">TO</th>
                      <th className="stats-table-header">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats
                      .filter(stat => !showDraftComparison || stat.Season === 2025)
                      .map((stat, index) => (
                      <tr key={index}>
                        <td className="stats-table-cell">{stat.Season} ({stat.Team})</td>
                        <td className="stats-table-cell">{stat.GP}</td>
                        <td className="stats-table-cell">{stat.MP?.toFixed(1)}</td>
                        <td className="stats-table-cell">{stat['FG%']?.toFixed(1)}</td>
                        <td className="stats-table-cell">{stat['3P%']?.toFixed(1)}</td>
                        <td className="stats-table-cell">{stat.FTP?.toFixed(1)}</td>
                        <td className="stats-table-cell">{stat.TRB?.toFixed(1)}</td>
                        <td className="stats-table-cell">{stat.AST?.toFixed(1)}</td>
                        <td className="stats-table-cell">{stat.BLK?.toFixed(1)}</td>
                        <td className="stats-table-cell">{stat.STL?.toFixed(1)}</td>
                        <td className="stats-table-cell">{stat.PF?.toFixed(1)}</td>
                        <td className="stats-table-cell">{stat.TOV?.toFixed(1)}</td>
                        <td className="stats-table-cell">{stat.PTS?.toFixed(1)}</td>
                      </tr>
                    ))}
                    {showDraftComparison && draftClassAverages && stats.length > 0 && (
                      <tr className="draft-class-average-row">
                        <td className="stats-table-cell">{draftClassAverages.Team}</td>
                        <td className="stats-table-cell">{draftClassAverages.GP}</td>
                        <td className="stats-table-cell">{draftClassAverages.MP?.toFixed(1)}</td>
                        <td className="stats-table-cell">{draftClassAverages['FG%']?.toFixed(1)}</td>
                        <td className="stats-table-cell">{draftClassAverages['3P%']?.toFixed(1)}</td>
                        <td className="stats-table-cell">{draftClassAverages.FTP?.toFixed(1)}</td>
                        <td className="stats-table-cell">{draftClassAverages.TRB?.toFixed(1)}</td>
                        <td className="stats-table-cell">{draftClassAverages.AST?.toFixed(1)}</td>
                        <td className="stats-table-cell">{draftClassAverages.BLK?.toFixed(1)}</td>
                        <td className="stats-table-cell">{draftClassAverages.STL?.toFixed(1)}</td>
                        <td className="stats-table-cell">{draftClassAverages.PF?.toFixed(1)}</td>
                        <td className="stats-table-cell">{draftClassAverages.TOV?.toFixed(1)}</td>
                        <td className="stats-table-cell">{draftClassAverages.PTS?.toFixed(1)}</td>
                      </tr>
                    )}
                    {showDraftComparison && draftClassAverages && stats.length > 0 && (
                      <tr className="comparison-row">
                        <td className="stats-table-cell">Comparison</td>
                        <td className={`stats-table-cell ${getComparisonClass('GP', stats[0].GP, draftClassAverages.GP)}`}>
                          {((stats[0].GP - draftClassAverages.GP) / draftClassAverages.GP * 100).toFixed(1)}%
                        </td>
                        <td className={`stats-table-cell ${getComparisonClass('MP', stats[0].MP, draftClassAverages.MP)}`}>
                          {((stats[0].MP - draftClassAverages.MP) / draftClassAverages.MP * 100).toFixed(1)}%
                        </td>
                        <td className={`stats-table-cell ${getComparisonClass('FG%', stats[0]['FG%'], draftClassAverages['FG%'])}`}>
                          {(stats[0]['FG%'] - draftClassAverages['FG%']).toFixed(1)}%
                        </td>
                        <td className={`stats-table-cell ${getComparisonClass('3P%', stats[0]['3P%'], draftClassAverages['3P%'])}`}>
                          {(stats[0]['3P%'] - draftClassAverages['3P%']).toFixed(1)}%
                        </td>
                        <td className={`stats-table-cell ${getComparisonClass('FTP', stats[0].FTP, draftClassAverages.FTP)}`}>
                          {(stats[0].FTP - draftClassAverages.FTP).toFixed(1)}%
                        </td>
                        <td className={`stats-table-cell ${getComparisonClass('TRB', stats[0].TRB, draftClassAverages.TRB)}`}>
                          {((stats[0].TRB - draftClassAverages.TRB) / draftClassAverages.TRB * 100).toFixed(1)}%
                        </td>
                        <td className={`stats-table-cell ${getComparisonClass('AST', stats[0].AST, draftClassAverages.AST)}`}>
                          {((stats[0].AST - draftClassAverages.AST) / draftClassAverages.AST * 100).toFixed(1)}%
                        </td>
                        <td className={`stats-table-cell ${getComparisonClass('BLK', stats[0].BLK, draftClassAverages.BLK)}`}>
                          {((stats[0].BLK - draftClassAverages.BLK) / draftClassAverages.BLK * 100).toFixed(1)}%
                        </td>
                        <td className={`stats-table-cell ${getComparisonClass('STL', stats[0].STL, draftClassAverages.STL)}`}>
                          {((stats[0].STL - draftClassAverages.STL) / draftClassAverages.STL * 100).toFixed(1)}%
                        </td>
                        <td className={`stats-table-cell ${getComparisonClass('PF', stats[0].PF, draftClassAverages.PF)}`}>
                          {((stats[0].PF - draftClassAverages.PF) / draftClassAverages.PF * 100).toFixed(1)}%
                        </td>
                        <td className={`stats-table-cell ${getComparisonClass('TOV', stats[0].TOV, draftClassAverages.TOV)}`}>
                          {((stats[0].TOV - draftClassAverages.TOV) / draftClassAverages.TOV * 100).toFixed(1)}%
                        </td>
                        <td className={`stats-table-cell ${getComparisonClass('PTS', stats[0].PTS, draftClassAverages.PTS)}`}>
                          {((stats[0].PTS - draftClassAverages.PTS) / draftClassAverages.PTS * 100).toFixed(1)}%
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add GamesPlayed component */}
            {player && <GamesPlayed playerId={player.playerId} />}
          </div>
        </div>

        <div className="profile-right-column">
          <div className="scouting-reports">
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1a1a1a',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Scouting Reports
            </h2>
            <div className="scouting-content">
              <div className="scouting-section">
                <Typography variant="h6" sx={{ 
                  color: '#1a1a1a', 
                  mb: 2, 
                  fontWeight: 500,
                  textAlign: 'center'
                }}>
                  Internal Scout Notes
                </Typography>
                {isAddingNote ? (
                  <div className="note-form" style={{ width: '90%'}}>
                    <input
                      type="text"
                      value={scoutName}
                      onChange={(e) => setScoutName(e.target.value)}
                      placeholder="Enter scout name..."
                      className="note-textarea"
                      style={{ 
                        fontSize: '0.8rem', 
                        fontFamily: 'Inter',
                        marginBottom: '0.5rem',
                        padding: '0.5rem'
                      }}
                    />
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Enter your scouting notes..."
                      rows={4}
                      className="note-textarea"
                      style={{ fontSize: '0.8rem', fontFamily: 'Inter'}}
                    />
                    <div className="note-form-buttons">
                      <button 
                        className="save-note-button" 
                        onClick={handleAddNote}
                        disabled={!newNote.trim() || !scoutName.trim()}
                      >
                        Save Note
                      </button>
                      <button 
                        className="cancel-note-button"
                        onClick={() => {
                          setIsAddingNote(false);
                          setNewNote('');
                          setScoutName('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setIsAddingNote(true)} className="back-button">Add a Report</button>
                )}
                <div className="internal-notes-list">
                  {internalNotes.map(note => (
                    <div key={note.id} className="internal-note">
                      <div className="note-header">
                        <div>
                          <Typography variant="subtitle2" sx={{ color: '#1d428a', fontWeight: 500 }}>
                            {note.scoutName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {note.date}
                          </Typography>
                        </div>
                        <button 
                          className="delete-note-button"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          ×
                        </button>
                      </div>
                      <Typography variant="body2" className="note-content" sx={{ whiteSpace: 'pre-wrap', color: '#333' }}>
                        {note.note}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              <Accordion 
                sx={{ 
                  backgroundColor: '#f8f9fa',
                  boxShadow: 'none',
                  '&:before': {
                    display: 'none',
                  },
                  borderRadius: '8px',
                  my: 2
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    padding: '1rem',
                    '& .MuiAccordionSummary-content': {
                      margin: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%'
                    },
                    '& .MuiAccordionSummary-expandIconWrapper': {
                      color: 'rgba(0, 0, 0, 0.54)',
                      position: 'absolute',
                      right: '1rem'
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ 
                    color: '#1a1a1a', 
                    fontWeight: 500, 
                    m: 0
                  }}>
                    External Scout Notes
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: '0 1rem 1rem 1rem' }}>
                  {scoutingReports.length > 0 ? (
                    scoutingReports.map((report, index) => (
                      <div key={report.reportId} className="scout-report">
                        <Typography variant="subtitle1" sx={{ color: '#1d428a', fontWeight: 500, mb: 1 }}>
                          Report from {report.scout}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333' }}>
                          {report.report}
                        </Typography>
                        {index < scoutingReports.length - 1 && <hr />}
                      </div>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      No scouting reports available
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>

              <div className="scouting-section">
                <div className="ratings-header">
                  <div className="ratings-title-container">
                    <Typography variant="h6" sx={{ 
                      color: '#1a1a1a', 
                      fontWeight: 500, 
                      m: 0,
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      Recent Ratings
                    </Typography>
                    <div className="info-tooltip-container">
                      <AiOutlineInfoCircle className="info-icon" />
                      <div className="info-tooltip">
                        <Typography variant="body2" sx={{ color: '#333', py: 0.5 }}>
                          The average rank represents the mean of all submitted rankings for each prospect.
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333', py: 0.5, borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
                          The <span className="ranking-trend trend-up">↑</span> and <span className="ranking-trend trend-down">↓</span> indicate whether a scout ranks a player significantly higher or lower than the overall average.
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333', py: 0.5 }}>
                          Not all scouts rank every player, so unranked entries are excluded from the average and are handled accordingly in the display.
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rankings-grid">
                  {scoutRankings && (
                    <>
                      <div className="ranking-item">
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }} className="scout-name">
                          Average Rank:
                        </Typography>
                        <span className="rank-value">
                          {playerService.getPlayerAverageRanking(player.playerId) ?? '-'}
                        </span>
                      </div>
                      <div className="ranking-item">
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }} className="scout-name">
                          ESPN:
                        </Typography>
                        <span className="rank-value">
                          {scoutRankings["ESPN Rank"] ?? '-'}
                          {scoutRankings["ESPN Rank"] && player && (
                            <span className={`ranking-trend ${
                              scoutRankings["ESPN Rank"] < (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? 'trend-up' :
                              scoutRankings["ESPN Rank"] > (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? 'trend-down' : 'trend-neutral'
                            }`}>
                              {scoutRankings["ESPN Rank"] < (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? '↑' :
                               scoutRankings["ESPN Rank"] > (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? '↓' : '→'}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="ranking-item">
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }} className="scout-name">
                          Sam Vecenie:
                        </Typography>
                        <span className="rank-value">
                          {scoutRankings["Sam Vecenie Rank"] ?? '-'}
                          {scoutRankings["Sam Vecenie Rank"] && player && (
                            <span className={`ranking-trend ${
                              scoutRankings["Sam Vecenie Rank"] < (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? 'trend-up' :
                              scoutRankings["Sam Vecenie Rank"] > (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? 'trend-down' : 'trend-neutral'
                            }`}>
                              {scoutRankings["Sam Vecenie Rank"] < (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? '↑' :
                               scoutRankings["Sam Vecenie Rank"] > (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? '↓' : '→'}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="ranking-item">
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }} className="scout-name">
                          Kevin O'Connor:
                        </Typography>
                        <span className="rank-value">
                          {scoutRankings["Kevin O'Connor Rank"] ?? '-'}
                          {scoutRankings["Kevin O'Connor Rank"] && player && (
                            <span className={`ranking-trend ${
                              scoutRankings["Kevin O'Connor Rank"] < (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? 'trend-up' :
                              scoutRankings["Kevin O'Connor Rank"] > (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? 'trend-down' : 'trend-neutral'
                            }`}>
                              {scoutRankings["Kevin O'Connor Rank"] < (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? '↑' :
                               scoutRankings["Kevin O'Connor Rank"] > (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? '↓' : '→'}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="ranking-item">
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }} className="scout-name">
                          Kyle Boone:
                        </Typography>
                        <span className="rank-value">
                          {scoutRankings["Kyle Boone Rank"] ?? '-'}
                          {scoutRankings["Kyle Boone Rank"] && player && (
                            <span className={`ranking-trend ${
                              scoutRankings["Kyle Boone Rank"] < (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? 'trend-up' :
                              scoutRankings["Kyle Boone Rank"] > (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? 'trend-down' : 'trend-neutral'
                            }`}>
                              {scoutRankings["Kyle Boone Rank"] < (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? '↑' :
                               scoutRankings["Kyle Boone Rank"] > (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? '↓' : '→'}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="ranking-item">
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }} className="scout-name">
                          Gary Parrish:
                        </Typography>
                        <span className="rank-value">
                          {scoutRankings["Gary Parrish Rank"] ?? '-'}
                          {scoutRankings["Gary Parrish Rank"] && player && (
                            <span className={`ranking-trend ${
                              scoutRankings["Gary Parrish Rank"] < (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? 'trend-up' :
                              scoutRankings["Gary Parrish Rank"] > (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? 'trend-down' : 'trend-neutral'
                            }`}>
                              {scoutRankings["Gary Parrish Rank"] < (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? '↑' :
                               scoutRankings["Gary Parrish Rank"] > (playerService.getPlayerAverageRanking(player.playerId) ?? 0) ? '↓' : '→'}
                            </span>
                          )}
                        </span>
                      </div>
                    </>
                  )}
                  {!scoutRankings && (
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      No rankings available
                    </Typography>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerProfile;