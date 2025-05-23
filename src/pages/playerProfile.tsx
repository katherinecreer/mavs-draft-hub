import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { playerService } from '../services/playerService';
import type { Player, SeasonLog, ScoutingReport, ScoutRanking } from '../services/playerService';
import '../styles/playerProfile.css';

const PlayerProfile = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<SeasonLog[]>([]);
  const [scoutingReports, setScoutingReports] = useState<ScoutingReport[]>([]);
  const [scoutRankings, setScoutRankings] = useState<ScoutRanking | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        setPlayer(playerData);
        setStats(playerStats);
        setScoutingReports(reports);
        setScoutRankings(rankings);
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

  console.log('Current state:', { loading, error, player, stats });

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
      <div className="navigation-controls">
        <button className="back-button" onClick={() => navigate('/draft-hub')}>
          Return to Hub
        </button>
        <div className="player-navigation">
          <button className="back-button prev" onClick={() => navigate(`/player/${parseInt(playerId || '0') - 1}`)}>
            &lt;
          </button>
          <button className="back-button next" onClick={() => navigate(`/player/${parseInt(playerId || '0') + 1}`)}>
            &gt;
          </button>
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
              <p><strong>Height:</strong> {Math.floor(player.height / 12)}'{player.height % 12}"</p>
              <p><strong>Weight:</strong> {player.weight} lbs</p>
              <button>Advanced Measurements</button>
              <p><strong>Birth Date:</strong> {new Date(player.birthDate).toLocaleDateString()}</p>
              <p><strong>Nationality:</strong> {player.nationality}</p>
              <p><strong>Hometown:</strong> {player.homeTown}, {player.homeState || player.homeCountry}</p>
              {player.highSchool && (
                <p><strong>High School:</strong> {player.highSchool}, {player.highSchoolState}</p>
              )}
            </div>
          </div>

          <div className="player-stats">
            <div className="stats-card">
              <h2>{player.name.split(' ').slice(-1)[0]}'s Career Statistics</h2>
              <button>Compare to Draft CLass</button>
              <br />
              <br />
              <div className="stats-table">
                <table>
                  <thead>
                    <tr>
                      <th>STATS</th>
                      <th>GP</th>
                      <th>MIN</th>
                      <th>FG%</th>
                      <th>3P%</th>
                      <th>FT%</th>
                      <th>REB</th>
                      <th>AST</th>
                      <th>BLK</th>
                      <th>STL</th>
                      <th>PF</th>
                      <th>TO</th>
                      <th>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((stat, index) => (
                      <tr key={index}>
                        <td>{stat.Season}</td>
                        <td>{stat.GP}</td>
                        <td>{stat.MP?.toFixed(1)}</td>
                        <td>{stat['FG%']?.toFixed(1)}</td>
                        <td>{stat['3P%']?.toFixed(1)}</td>
                        <td>{stat.FTP?.toFixed(1)}</td>
                        <td>{stat.TRB?.toFixed(1)}</td>
                        <td>{stat.AST?.toFixed(1)}</td>
                        <td>{stat.BLK?.toFixed(1)}</td>
                        <td>{stat.STL?.toFixed(1)}</td>
                        <td>{stat.PF?.toFixed(1)}</td>
                        <td>{stat.TOV?.toFixed(1)}</td>
                        <td>{stat.PTS?.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-right-column">
          <div className="scouting-reports">
            <h2>Scouting Reports</h2>
            <div className="scouting-content">
              <div className="scouting-section">
                <button>Add a Report</button>
                <h3>Internal Scout Notes</h3>
              </div>
              <div className="scouting-section">
                <h3>External Scout Notes</h3>
                {scoutingReports.length > 0 ? (
                  scoutingReports.map((report, index) => (
                    <div key={report.reportId} className="scout-report">
                      <h4>Report from {report.scout}</h4>
                      <p>{report.report}</p>
                      {index < scoutingReports.length - 1 && <hr />}
                    </div>
                  ))
                ) : (
                  <p>No scouting reports available</p>
                )}
              </div>
              <div className="scouting-section">
                <h3>Recent Ratings</h3>
                <div className="rankings-grid">
                  {scoutRankings && (
                    <>
                      <div className="ranking-item">
                        <span className="scout-name">ESPN:</span>
                        <span className="rank-value">{scoutRankings["ESPN Rank"] ?? '-'}</span>
                      </div>
                      <div className="ranking-item">
                        <span className="scout-name">Sam Vecenie:</span>
                        <span className="rank-value">{scoutRankings["Sam Vecenie Rank"] ?? '-'}</span>
                      </div>
                      <div className="ranking-item">
                        <span className="scout-name">Kevin O'Connor:</span>
                        <span className="rank-value">{scoutRankings["Kevin O'Connor Rank"] ?? '-'}</span>
                      </div>
                      <div className="ranking-item">
                        <span className="scout-name">Kyle Boone:</span>
                        <span className="rank-value">{scoutRankings["Kyle Boone Rank"] ?? '-'}</span>
                      </div>
                      <div className="ranking-item">
                        <span className="scout-name">Gary Parrish:</span>
                        <span className="rank-value">{scoutRankings["Gary Parrish Rank"] ?? '-'}</span>
                      </div>
                    </>
                  )}
                  {!scoutRankings && <p>No rankings available</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile; 