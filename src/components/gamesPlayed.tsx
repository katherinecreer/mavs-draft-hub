import { useState, useEffect } from 'react';
import { playerService } from '../services/playerService';
import type { GameLog } from '../services/playerService';
import '../styles/gamesPlayed.css';
import { TablePagination } from '@mui/material';

interface GamesPlayedProps {
  playerId: number;
}

const GamesPlayed = ({ playerId }: GamesPlayedProps) => {
  const [games, setGames] = useState<GameLog[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [seasons, setSeasons] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const logs = playerService.getPlayerGameLogs(playerId);
    const sortedLogs = logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setGames(sortedLogs);
    
    const uniqueSeasons = Array.from(new Set(logs.map(log => log.season)))
      .sort((a, b) => b - a);
    setSeasons(uniqueSeasons);
    setSelectedSeason(uniqueSeasons[0] || null);
  }, [playerId]);

  // Reset page when season changes
  useEffect(() => {
    setPage(0);
  }, [selectedSeason]);

  const filteredGames = games.filter(game => game.season === selectedSeason);
  const displayGames = filteredGames.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="games-played-container">
      <div className="games-played-header">
        <h2>Games Played</h2>
        <div className="games-played-controls">
          <select 
            value={selectedSeason || ''}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
            className="season-selector"
          >
            {seasons.map(season => (
              <option key={season} value={season}>
                {season} Season
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="games-played-table-container">
        <table className="games-played-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Team</th>
              <th>OPP</th>
              <th>Result</th>
              <th>MIN</th>
              <th>PTS</th>
              <th>REB</th>
              <th>AST</th>
              <th>STL</th>
              <th>BLK</th>
              <th>TO</th>
              <th>FG</th>
              <th>3P</th>
              <th>FT</th>
              <th>+/-</th>
            </tr>
          </thead>
          <tbody>
            {displayGames.map((game) => (
              <tr key={game.gameId}>
                <td>{new Date(game.date).toLocaleDateString()}</td>
                <td>{game.team}</td>
                <td>{game.opponent}</td>
                <td>{game.isHome ? 
                  `${game.homeTeamPts}-${game.visitorTeamPts}` :
                  `${game.visitorTeamPts}-${game.homeTeamPts}`
                }</td>
                <td>{game.timePlayed}</td>
                <td>{game.pts}</td>
                <td>{game.reb}</td>
                <td>{game.ast}</td>
                <td>{game.stl}</td>
                <td>{game.blk}</td>
                <td>{game.tov}</td>
                <td>{`${game.fgm}-${game.fga}`}</td>
                <td>{`${game.tpm}-${game.tpa}`}</td>
                <td>{`${game.ftm}-${game.fta}`}</td>
                <td>{game.plusMinus}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <TablePagination
          component="div"
          count={filteredGames.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
          sx={{
            '.MuiTablePagination-select': {
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem'
            }
          }}
        />
      </div>
    </div>
  );
};

export default GamesPlayed; 