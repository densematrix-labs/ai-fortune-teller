export interface Scores {
  spread: number;
  funding: number;
  tech: number;
  users: number;
  competition: number;
}

export interface FortuneResult {
  fortune_level: string;
  reading: string;
  advice: string[];
  scores: Scores;
}

export type FortuneStyle = 'tarot' | 'yijing' | 'zodiac' | 'crystal';

export interface StyleOption {
  id: FortuneStyle;
  name: string;
  icon: string;
  description: string;
}
