import React, { useState } from 'react';
import type { Player } from '../services/playerService';
import { playerService } from '../services/playerService';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

interface draftBigBoardProps {
  players: Player[];
  handlePlayerClick: (playerId: number) => void;
  onPlayerHover: (player: Player | undefined) => void;
}

const draftBigBoard: React.FC<draftBigBoardProps> = ({ players, handlePlayerClick, onPlayerHover }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sort players by ADP and filter based on search term
  const displayedPlayers = [...players]
    .filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const adpA = playerService.getPlayerAverageRanking(a.playerId);
      const adpB = playerService.getPlayerAverageRanking(b.playerId);
      
      // Handle null values - push them to the end
      if (adpA === null && adpB === null) return 0;
      if (adpA === null) return 1;
      if (adpB === null) return -1;
      
      return adpA - adpB;
    })
    .slice(0, 1000);

  return (
    <section className="big-board-panel">
      <h2>Available Players</h2>
      <div className="search-container">
        <TextField
          variant="outlined"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { backgroundColor: 'white', borderRadius: 1 }
          }}
        />
      </div>
      <br />
      <div className="big-board-list">
        <div className="big-board-header">
          <span></span>
          <span style={{ textAlign: 'left', justifySelf: 'start' }}>Player Name</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>ADP</span>
            <p style={{fontSize: '8px', margin: 0}}>Average Draft Position (Prospective)</p>
          </div>
        </div>
        <div className="big-board-scrollable">
          {displayedPlayers.map((player) => {
            const averageRanking = playerService.getPlayerAverageRanking(player.playerId);
            return (
              <div
                key={player.playerId}
                className="big-board-row"
                onClick={() => handlePlayerClick(player.playerId)}
                onMouseEnter={() => onPlayerHover(player)}
                onMouseLeave={() => onPlayerHover(undefined)}
                style={{ cursor: 'pointer' }}
              >
                <div className="player-avatar" style={{ marginLeft: '15px' }}>
                  {player.photoUrl ? (
                    <img src={player.photoUrl} alt={player.name} />
                  ) : (
                    <div className="avatar-placeholder" />
                  )}
                </div>
                <span className="player-name" style={{ textAlign: 'left' }}>{player.name}</span>
                <span className="player-ranking">{averageRanking !== null ? averageRanking : '-'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default draftBigBoard; 