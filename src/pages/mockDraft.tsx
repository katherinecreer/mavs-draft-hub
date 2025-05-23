import { useState, useEffect } from 'react';
import type { DraftPlayer, DraftOrder, DraftPick } from '../types/draft';
import draftOrderData from '../data/draft_order_2025.json';
import playerData from '../data/intern_project_data.json';
import '../styles/mockDraft.css';

const MockDraft = () => {
  const [availablePlayers, setAvailablePlayers] = useState<DraftPlayer[]>([]);
  const [draftOrder, setDraftOrder] = useState<DraftPick[]>([]);
  const [currentPick, setCurrentPick] = useState(1);

  useEffect(() => {
    // Initialize available players from the bio data
    setAvailablePlayers(playerData.bio);

    // Initialize draft order from the draft order data
    const initialDraftOrder: DraftPick[] = (draftOrderData as DraftOrder[]).map(pick => ({
      pickNumber: pick.pick,
      team: pick.team
    }));
    setDraftOrder(initialDraftOrder);
  }, []);

  const handlePlayerSelect = (player: DraftPlayer) => {
    // Update the draft order with the selected player
    const updatedDraftOrder = draftOrder.map(pick => {
      if (pick.pickNumber === currentPick) {
        return { ...pick, selectedPlayer: player };
      }
      return pick;
    });

    // Remove the selected player from available players
    const updatedPlayers = availablePlayers.filter(p => p.playerId !== player.playerId);

    setDraftOrder(updatedDraftOrder);
    setAvailablePlayers(updatedPlayers);
    setCurrentPick(prev => prev + 1);
  };

  const getCurrentTeam = () => {
    return draftOrder.find(pick => pick.pickNumber === currentPick)?.team || '';
  };

  const formatHeight = (inches: number) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  return (
    <div className="mock-draft-container">
      <div className="draft-board">
        <div className="draft-header">
          <h2>2025 NBA Mock Draft</h2>
          <div className="current-pick">
            <h3>On the Clock: {getCurrentTeam()}</h3>
            <p>Pick #{currentPick}</p>
          </div>
        </div>
        
        <div className="draft-columns">
          <div className="available-players">
            <h3>Available Players</h3>
            <div className="players-list">
              {availablePlayers.map(player => (
                <div 
                  key={player.playerId} 
                  className="player-card"
                  onClick={() => handlePlayerSelect(player)}
                >
                  <h4>{player.name}</h4>
                  <p>{player.currentTeam}</p>
                  <p>{formatHeight(player.height)}, {player.weight} lbs</p>
                  <p>{player.nationality}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="draft-results">
            <h3>Draft Results</h3>
            <div className="results-list">
              {draftOrder.map(pick => (
                <div key={pick.pickNumber} className="draft-pick-result">
                  <span className="pick-number">{pick.pickNumber}.</span>
                  <span className="team-name">{pick.team}</span>
                  {pick.selectedPlayer && (
                    <span className="selected-player">
                      {pick.selectedPlayer.name} ({pick.selectedPlayer.currentTeam})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockDraft;
