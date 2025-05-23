import React from 'react';
import type { Player } from '../services/playerService';
import { playerService } from '../services/playerService';

interface draftBigBoardProps {
  players: Player[];
  handlePlayerClick: (playerId: number) => void;
}

const draftBigBoard: React.FC<draftBigBoardProps> = ({ players, handlePlayerClick }) => {
  // Sort players by ADP and take first 1000
  const displayedPlayers = [...players]
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
      <div>Search Needs to be Here</div>
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
                style={{ cursor: 'pointer' }}
              >
                <div className="player-avatar" style={{ marginLeft: '15px' }}>
                  {player.photoUrl ? (
                    <img src={player.photoUrl} alt={player.name} />
                  ) : (
                    <div className="avatar-placeholder" />
                  )}
                </div>
                <span className="player-name">{player.name}</span>
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