import { Building } from './types';
import { MousePointer2, Satellite, Radio, Zap, Box, Factory, Atom } from 'lucide-react';

export const GAME_TICK_RATE_MS = 100;

export const BUILDINGS: Building[] = [
  {
    id: 'probe',
    name: 'Probe',
    baseCost: 15,
    baseIncome: 0.5,
    description: 'A basic automated drone for gathering dust.',
    icon: 'Radio'
  },
  {
    id: 'drone',
    name: 'Miner Drone',
    baseCost: 100,
    baseIncome: 2,
    description: 'Drills into asteroids to extract core fragments.',
    icon: 'Box'
  },
  {
    id: 'station',
    name: 'Space Station',
    baseCost: 500,
    baseIncome: 10,
    description: 'A hub for processing cosmic debris.',
    icon: 'Satellite'
  },
  {
    id: 'factory',
    name: 'Orbital Factory',
    baseCost: 2500,
    baseIncome: 45,
    description: 'Mass produces refined energy cells.',
    icon: 'Factory'
  },
  {
    id: 'reactor',
    name: 'Fusion Reactor',
    baseCost: 12000,
    baseIncome: 180,
    description: 'Harnesses the power of a small star.',
    icon: 'Zap'
  },
  {
    id: 'collider',
    name: 'Hadron Collider',
    baseCost: 65000,
    baseIncome: 750,
    description: 'Rips apart the fabric of reality for profit.',
    icon: 'Atom'
  }
];

export const INITIAL_STATE = {
  score: 0,
  totalLifetime: 0,
  clickCount: 0,
  clickLevel: 1,
  buildings: BUILDINGS.reduce((acc, b) => ({ ...acc, [b.id]: 0 }), {}),
  startTime: Date.now(),
};