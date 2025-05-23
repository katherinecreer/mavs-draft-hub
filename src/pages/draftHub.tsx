import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { playerService } from '../services/playerService';
import type { Player } from '../services/playerService';
import '../styles/draftHub.css';
import DraftOrderPanel from '../components/draftOrder';
import BigBoardPanel from '../components/draftBigBoard';
import ActionButtonsPanel from '../components/ActionButtonsPanel';

const DraftHub = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const data = await playerService.getAllPlayers();
        setPlayers(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch players');
        console.error('Error fetching players:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handlePlayerClick = (playerId: number) => {
    navigate(`/player/${playerId}`);
  };

  if (loading) {
    return <div className="loading">Loading players...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="draft-hub-outer">
      <div className="draft-hub-main">
        <DraftOrderPanel />
        <BigBoardPanel players={players} handlePlayerClick={handlePlayerClick} />
        <ActionButtonsPanel />
      </div>
    </div>
  );
};

export default DraftHub; 