export interface DraftPlayer {
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

export interface DraftOrder {
  pick: number;
  team: string;
}

export interface DraftPick {
  pickNumber: number;
  team: string;
  selectedPlayer?: DraftPlayer;
} 