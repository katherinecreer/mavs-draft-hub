import playerData from '../data/intern_project_data.json';

export interface Player {
  name: string;
  playerId: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  height: number;
  weight: number;
  highSchool: string | null;
  highSchoolState: string | null;
  homeTown: string;
  homeState: string | null;
  homeCountry: string;
  nationality: string;
  photoUrl: string | null;
  currentTeam: string;
  league: string;
  leagueType: string;
}

export interface Measurement {
  playerId: number;
  heightNoShoes: number | null;
  heightShoes: number | null;
  wingspan: number | null;
  reach: number | null;
  maxVertical: number | null;
  noStepVertical: number | null;
  weight: number | null;
  bodyFat: number | null;
  handLength: number | null;
  handWidth: number | null;
  agility: number | null;
  sprint: number | null;
  shuttleLeft: number | null;
  shuttleRight: number | null;
  shuttleBest: number | null;
}

export interface GameLog {
  playerId: number;
  gameId: number;
  date: string;
  season: number;
  league: string;
  team: string;
  teamId: number;
  opponent: string;
  opponentId: number;
  isHome: boolean | null;
  homeTeamPts: number;
  visitorTeamPts: number;
  gp: number;
  gs: number;
  pts: number;
  ast: number;
  reb: number;
  dreb: number;
  oreb: number;
  stl: number;
  blk: number;
  pf: number;
  tov: number;
  plusMinus: number;
  timePlayed: string;
  fga: number;
  fgm: number;
  'fg%': number | null;
  fta: number;
  ftm: number;
  'ft%': number | null;
  tpa: number;
  tpm: number;
  'tp%': number | null;
  rn: number;
}

export interface SeasonLog {
  playerId: number;
  Season: number;
  Team: string;
  League: string;
  GP: number;
  GS: number;
  MP: number;
  PTS: number;
  AST: number;
  STL: number;
  BLK: number;
  TOV: number;
  PF: number;
  FGM: number;
  FGA: number;
  'FG%': number;
  FG2M: number;
  FG2A: number;
  'FG2%': number;
  '3PM': number;
  '3PA': number;
  '3P%': number;
  FT: number;
  FTA: number;
  FTP: number;
  ORB: number;
  DRB: number;
  TRB: number;
  'eFG%': number;
  age: string;
  w: number;
  l: number;
}

export interface ScoutRanking {
  playerId: number;
  "ESPN Rank": number | null;
  "Sam Vecenie Rank": number | null;
  "Kevin O'Connor Rank": number | null;
  "Kyle Boone Rank": number | null;
  "Gary Parrish Rank": number | null;
}

export interface ScoutingReport {
  scout: string;
  reportId: string;
  playerId: number;
  report: string;
}

export const playerService = {
  // Get all players
  getAllPlayers(): Player[] {
    return playerData.bio || [];
  },

  // Search players
  searchPlayers(query: string): Player[] {
    const searchTerm = query.toLowerCase();
    return playerData.bio?.filter(player => 
      player.name.toLowerCase().includes(searchTerm) ||
      player.currentTeam.toLowerCase().includes(searchTerm) ||
      player.league.toLowerCase().includes(searchTerm)
    ) || [];
  },

  // Get player by ID
  getPlayerById(id: number): Player | undefined {
    return playerData.bio?.find(player => player.playerId === id);
  },

  // Get player measurements
  getPlayerMeasurements(id: number): Measurement | undefined {
    return playerData.measurements?.find(measurement => measurement.playerId === id);
  },

  // Get player game logs
  getPlayerGameLogs(id: number): GameLog[] {
    return playerData.game_logs?.filter(log => log.playerId === id)
      .map(log => ({
        ...log,
        isHome: log.isHome === null ? null : Boolean(log.isHome)
      })) || [];
  },

  // Get player season logs
  getPlayerSeasonLogs(id: number): SeasonLog[] {
    return playerData.seasonLogs?.filter(log => log.playerId === id) || [];
  },

  // Get player scout rankings
  getPlayerScoutRankings(id: number): ScoutRanking | undefined {
    return playerData.scoutRankings?.find(ranking => ranking.playerId === id);
  },

  // Get player average ranking
  getPlayerAverageRanking(id: number): number | null {
    const rankings = this.getPlayerScoutRankings(id);
    if (!rankings) return null;

    const rankValues = [
      rankings["ESPN Rank"],
      rankings["Sam Vecenie Rank"],
      rankings["Kevin O'Connor Rank"],
      rankings["Kyle Boone Rank"],
      rankings["Gary Parrish Rank"]
    ].filter(rank => rank !== null) as number[];

    if (rankValues.length === 0) return null;

    const sum = rankValues.reduce((acc, curr) => acc + curr, 0);
    return Number((sum / rankValues.length).toFixed(2));
  },

  // Get player scouting reports
  getPlayerScoutingReports(id: number): ScoutingReport[] {
    return playerData.scoutingReports?.filter(report => report.playerId === id) || [];
  },

  // Get all scouting reports
  getAllScoutingReports(): ScoutingReport[] {
    return playerData.scoutingReports || [];
  },

  // Get all scout rankings
  getAllScoutRankings(): ScoutRanking[] {
    return playerData.scoutRankings || [];
  },

  // Get all season logs
  getAllSeasonLogs(): SeasonLog[] {
    return playerData.seasonLogs || [];
  },

  // Calculate draft class averages for a specific season
  getDraftClassAverages(season: number): SeasonLog {
    const seasonLogs = this.getAllSeasonLogs().filter(log => 
      log.Season === season && 
      log.League === 'NCAA' // Only include NCAA stats for fair comparison
    );

    if (seasonLogs.length === 0) {
      throw new Error(`No season logs found for season ${season}`);
    }

    const totalLogs = seasonLogs.length;
    const averages: SeasonLog = {
      playerId: -1, // Use -1 to indicate this is an average
      Season: season,
      Team: 'Draft Class Average',
      League: 'NCAA',
      GP: 0,
      GS: 0,
      MP: 0,
      FGM: 0,
      FGA: 0,
      'FG%': 0,
      FG2M: 0,
      FG2A: 0,
      'FG2%': 0,
      'eFG%': 0,
      '3PM': 0,
      '3PA': 0,
      '3P%': 0,
      FT: 0,
      FTA: 0,
      FTP: 0,
      ORB: 0,
      DRB: 0,
      TRB: 0,
      AST: 0,
      STL: 0,
      BLK: 0,
      TOV: 0,
      PF: 0,
      PTS: 0,
      age: 'Average',
      w: 0,
      l: 0
    };

    // Sum up all stats
    seasonLogs.forEach(log => {
      averages.GP += log.GP;
      averages.GS += log.GS;
      averages.MP += log.MP;
      averages.FGM += log.FGM;
      averages.FGA += log.FGA;
      averages['3PM'] += log['3PM'];
      averages['3PA'] += log['3PA'];
      averages.FT += log.FT;
      averages.FTA += log.FTA;
      averages.TRB += log.TRB;
      averages.AST += log.AST;
      averages.BLK += log.BLK;
      averages.STL += log.STL;
      averages.PF += log.PF;
      averages.TOV += log.TOV;
      averages.PTS += log.PTS;
      averages.w += log.w;
      averages.l += log.l;
    });

    // Calculate averages
    (Object.keys(averages) as Array<keyof SeasonLog>).forEach(key => {
      const value = averages[key];
      if (typeof value === 'number' && key !== 'playerId' && key !== 'Season' && key !== 'age') {
        (averages[key] as number) = Number((value / totalLogs).toFixed(1));
      }
    });

    // Calculate percentages
    averages['FG%'] = Number(((averages.FGM / averages.FGA) * 100).toFixed(1));
    averages['3P%'] = Number(((averages['3PM'] / averages['3PA']) * 100).toFixed(1));
    averages.FTP = Number(((averages.FT / averages.FTA) * 100).toFixed(1));

    return averages;
  }
}; 