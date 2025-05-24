import React from 'react';
import { playerService } from '../services/playerService';
import type { Player } from '../services/playerService';
import '../styles/draftHub.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface ActionButtonsPanelProps {
  hoveredPlayer?: Player;
}

type StatKey = 'PTS' | 'AST' | 'TRB' | 'BLK' | 'STL';

const ActionButtonsPanel: React.FC<ActionButtonsPanelProps> = ({ hoveredPlayer }) => {
  const totalPlayers = playerService.getAllPlayers().length;

  // Get the latest season from all season logs
  const allSeasonLogs = playerService.getAllSeasonLogs();
  const latestSeason = allSeasonLogs.length > 0 ? Math.max(...allSeasonLogs.map(log => log.Season)) : null;
  const draftAverages = latestSeason ? playerService.getDraftClassAverages(latestSeason) : null;

  // Get player stats and rankings if hovered
  const playerStats = hoveredPlayer ? playerService.getPlayerSeasonLogs(hoveredPlayer.playerId) : [];
  const playerAverageRanking = hoveredPlayer ? playerService.getPlayerAverageRanking(hoveredPlayer.playerId) : null;

  // Top 5 most common stats
  const statLabels: Record<StatKey, string> = {
    PTS: 'Points',
    AST: 'Assists',
    TRB: 'Rebounds',
    BLK: 'Blocks',
    STL: 'Steals',
  };
  const statKeys: StatKey[] = ['PTS', 'AST', 'TRB', 'BLK', 'STL'];

  // Calculate player's rank for each stat
  const getPlayerStatRank = (stat: StatKey) => {
    if (!hoveredPlayer || !playerStats.length || !draftAverages) return null;
    
    const playerStat = playerStats[0][stat];
    const allPlayers = playerService.getAllPlayers();
    const allPlayerStats = allPlayers.map(player => {
      const stats = playerService.getPlayerSeasonLogs(player.playerId);
      return stats.length > 0 ? stats[0][stat] : 0;
    });

    // Sort stats in descending order and find player's rank
    const sortedStats = [...allPlayerStats].sort((a, b) => b - a);
    const rank = sortedStats.indexOf(playerStat) + 1;
    return rank;
  };

  return (
    <section className="action-buttons-panel" style={{ alignItems: 'stretch', justifyContent: 'flex-start' }}>
      <h2>Quick Actions</h2>
      <div style={{ marginBottom: '1rem', minHeight: '64px', width: '100%', background: '#f4f6fa', borderRadius: '10px', padding: '1rem' }}>
        {hoveredPlayer ? (
          <>
            <div>{hoveredPlayer.name}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 600, marginTop: '0.5rem', color: '#12508b' }}>
              ADP: {playerAverageRanking ? `${playerAverageRanking} / ${totalPlayers}` : '-'}
            </div>
          </>
        ) : (
          <>
            <div>Number of Prospects</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 600, marginTop: '0.5rem', color: '#12508b' }}>{totalPlayers}</div>
          </>
        )}
      </div>
      <div style={{ marginBottom: '1rem', minHeight: '64px', width: '100%', background: '#f4f6fa', borderRadius: '10px', padding: '1rem' }}>
        <div>{hoveredPlayer ? 'Player Statistics' : 'Average Draft Statistics'}</div>
        {draftAverages && (
          <TableContainer component={Paper} elevation={0} sx={{ mt: 1, mb: 1, boxShadow: 'none', background: 'none', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
            <Table size="small" aria-label="draft averages table">
              <TableBody>
                {statKeys.map((key) => {
                  const playerStat = hoveredPlayer && playerStats.length > 0 ? playerStats[0][key] : null;
                  const statRank = hoveredPlayer ? getPlayerStatRank(key) : null;
                  return (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 500, border: 0, color: '#1a2233', background: 'none' }}>
                        {statLabels[key]}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, border: 0, color: '#1a2233', background: 'none' }}>
                        {hoveredPlayer ? (
                          <>
                            {playerStat?.toFixed(1)}
                            {statRank && <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#666' }}>#{statRank}</span>}
                          </>
                        ) : (
                          draftAverages[key].toFixed(1)
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      {/* Resources Heading */}
      <div style={{ minHeight: '40px', width: '100%', color: '#12508b', background: 'none', padding: 0, marginBottom: 0 }}>
        <h2 style={{ margin: 0 }}>Resources</h2>
      </div>
      {/* Resource Links Container */}
      <div style={{ minHeight: '40px', width: '100%', background: '#f4f6fa', borderRadius: '10px', padding: '0 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
        <a href="https://www.nba.com/stats/draft/combine-strength-agility" target="_blank" rel="noopener noreferrer" style={{ color: '#5a6ff0', textDecoration: 'none', fontSize: '1rem' }}>
          NBA Comine Official Statistics
        </a>
        <a href="https://www.spotrac.com/nba/" target="_blank" rel="noopener noreferrer" style={{ color: '#5a6ff0', textDecoration: 'none', fontSize: '1rem' }}>
          NBA Contracts & Cap Sheets
        </a>
        <a href="https://www.nba.com/players" target="_blank" rel="noopener noreferrer" style={{ color: '#5a6ff0', textDecoration: 'none', fontSize: '1rem' }}>
          Full League Rosters
        </a>
      </div>
    </section>
  );
};

export default ActionButtonsPanel;
