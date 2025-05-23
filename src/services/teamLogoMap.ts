import {
  ATL, BOS, BKN, CHA, CHI, CLE, DAL, DEN, DET, GSW,
  HOU, IND, LAC, LAL, MEM, MIA, MIL, MIN, NOP, NYK,
  OKC, ORL, PHI, PHX, POR, SAC, SAS, TOR, UTA, WAS
} from 'react-nba-logos';

import type { ComponentType } from 'react';

export const teamLogoMap: Record<string, ComponentType<{ size?: number }>> = {
  "Atlanta Hawks": ATL as ComponentType<{ size?: number }>,
  "Boston Celtics": BOS as ComponentType<{ size?: number }>,
  "Brooklyn Nets": BKN as ComponentType<{ size?: number }>,
  "Charlotte Hornets": CHA as ComponentType<{ size?: number }>,
  "Chicago Bulls": CHI as ComponentType<{ size?: number }>,
  "Cleveland Cavaliers": CLE as ComponentType<{ size?: number }>,
  "Dallas Mavericks": DAL as ComponentType<{ size?: number }>,
  "Denver Nuggets": DEN as ComponentType<{ size?: number }>,
  "Detroit Pistons": DET as ComponentType<{ size?: number }>,
  "Golden State Warriors": GSW as ComponentType<{ size?: number }>,
  "Houston Rockets": HOU as ComponentType<{ size?: number }>,
  "Indiana Pacers": IND as ComponentType<{ size?: number }>,
  "LA Clippers": LAC as ComponentType<{ size?: number }>,
  "Los Angeles Lakers": LAL as ComponentType<{ size?: number }>,
  "Memphis Grizzlies": MEM as ComponentType<{ size?: number }>,
  "Miami Heat": MIA as ComponentType<{ size?: number }>,
  "Milwaukee Bucks": MIL as ComponentType<{ size?: number }>,
  "Minnesota Timberwolves": MIN as ComponentType<{ size?: number }>,
  "New Orleans Pelicans": NOP as ComponentType<{ size?: number }>,
  "New York Knicks": NYK as ComponentType<{ size?: number }>,
  "Oklahoma City Thunder": OKC as ComponentType<{ size?: number }>,
  "Orlando Magic": ORL as ComponentType<{ size?: number }>,
  "Philadelphia 76ers": PHI as ComponentType<{ size?: number }>,
  "Phoenix Suns": PHX as ComponentType<{ size?: number }>,
  "Portland Trail Blazers": POR as ComponentType<{ size?: number }>,
  "Sacramento Kings": SAC as ComponentType<{ size?: number }>,
  "San Antonio Spurs": SAS as ComponentType<{ size?: number }>,
  "Toronto Raptors": TOR as ComponentType<{ size?: number }>,
  "Utah Jazz": UTA as ComponentType<{ size?: number }>,
  "Washington Wizards": WAS as ComponentType<{ size?: number }>,
};
