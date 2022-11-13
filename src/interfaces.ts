export interface MatchProps {
  id: string;
  game: number;
  fifaId: string;
  round: number;
  group: string;
  date: string;
  timestamp: number;
  location: string;
  home: string;
  homeName: string;
  homeScore: number | null;
  away: string;
  awayName: string;
  awayScore: number | null;
}

export interface UserProps {
  id: string;
  email: string;
  userName: string;
  displayName: string;
  photoURL: string;
  ranking: number;
  score: number;
}

export interface TeamProps {
  id: string;
  code: string;
  name: string;
  group: string;
}

export interface PredictionProps extends MatchProps {
  uid: string;
  homePrediction: number;
  awayPrediction: number;
  points: number;
}
