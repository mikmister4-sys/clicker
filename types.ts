export interface Building {
  id: string;
  name: string;
  baseCost: number;
  baseIncome: number;
  description: string;
  icon: string;
}

export interface GameState {
  score: number;
  totalLifetime: number;
  clickCount: number;
  clickLevel: number;
  buildings: Record<string, number>; // buildingId -> quantity
  startTime: number;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  value: string;
  createdAt: number;
}

export interface ChartDataPoint {
  time: string;
  value: number;
}