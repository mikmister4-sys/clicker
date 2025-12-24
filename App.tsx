import React, { useState, useEffect, useRef, useCallback } from 'react';
import { INITIAL_STATE, BUILDINGS, GAME_TICK_RATE_MS } from './constants';
import { GameState, FloatingText, ChartDataPoint } from './types';
import { CoreCrystal } from './components/CoreCrystal';
import { UpgradeShop } from './components/UpgradeShop';
import { FloatingTextLayer } from './components/FloatingTextLayer';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Activity, Clock } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to load from localStorage
    try {
      const saved = localStorage.getItem('cosmoClickerSave');
      return saved ? JSON.parse(saved) : INITIAL_STATE;
    } catch (e) {
      return INITIAL_STATE;
    }
  });

  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  // Refs for loop management to avoid stale closures
  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  // --- Helpers ---
  const formatNumber = (n: number): string => {
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
    return n < 10 && n > 0 ? n.toFixed(1) : Math.floor(n).toString();
  };

  const calculateAutoCps = useCallback((state: GameState) => {
    return BUILDINGS.reduce((total, b) => {
      return total + (b.baseIncome * (state.buildings[b.id] || 0));
    }, 0);
  }, []);

  const calculateClickValue = useCallback((state: GameState) => {
    return state.clickLevel; // Simple linear scaling, could be exponential later
  }, []);

  // --- Game Loop ---
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentCps = calculateAutoCps(stateRef.current);
      const incomePerTick = currentCps / (1000 / GAME_TICK_RATE_MS);

      if (incomePerTick > 0) {
        setGameState(prev => ({
          ...prev,
          score: prev.score + incomePerTick,
          totalLifetime: prev.totalLifetime + incomePerTick
        }));
      }

      // Update Chart Data every second (approx 10 ticks)
      if (Date.now() % 1000 < 150) {
         const now = new Date();
         const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
         setChartData(prev => {
            const newData = [...prev, { time: timeStr, value: stateRef.current.score }];
            if (newData.length > 20) newData.shift(); // Keep last 20 seconds
            return newData;
         });
      }

    }, GAME_TICK_RATE_MS);

    // Save loop
    const saveInterval = setInterval(() => {
        localStorage.setItem('cosmoClickerSave', JSON.stringify(stateRef.current));
    }, 5000);

    return () => {
        clearInterval(intervalId);
        clearInterval(saveInterval);
    };
  }, [calculateAutoCps]);


  // --- Interactions ---
  const handleCoreClick = (clientX: number, clientY: number) => {
    const clickValue = calculateClickValue(gameState);
    
    // Update State
    setGameState(prev => ({
      ...prev,
      score: prev.score + clickValue,
      totalLifetime: prev.totalLifetime + clickValue,
      clickCount: prev.clickCount + 1
    }));

    // Add Floating Text
    const newText: FloatingText = {
      id: Date.now(),
      x: clientX,
      y: clientY,
      value: formatNumber(clickValue),
      createdAt: Date.now()
    };
    
    setFloatingTexts(prev => [...prev, newText]);

    // Clean up old texts
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== newText.id));
    }, 800);
  };

  const buyClickUpgrade = () => {
    const cost = Math.floor(50 * Math.pow(1.7, gameState.clickLevel - 1));
    if (gameState.score >= cost) {
      setGameState(prev => ({
        ...prev,
        score: prev.score - cost,
        clickLevel: prev.clickLevel + 1
      }));
    }
  };

  const buyBuilding = (buildingId: string) => {
    const building = BUILDINGS.find(b => b.id === buildingId);
    if (!building) return;

    const currentCount = gameState.buildings[buildingId] || 0;
    const cost = Math.floor(building.baseCost * Math.pow(1.15, currentCount));

    if (gameState.score >= cost) {
      setGameState(prev => ({
        ...prev,
        score: prev.score - cost,
        buildings: {
          ...prev.buildings,
          [buildingId]: currentCount + 1
        }
      }));
    }
  };

  const currentCps = calculateAutoCps(gameState);

  // --- Render ---
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-950 text-white font-sans overflow-hidden">
      <FloatingTextLayer texts={floatingTexts} />

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col relative z-0 min-h-0">
        
        {/* Header Stats */}
        <header className="flex-none h-20 md:h-24 bg-slate-900/50 backdrop-blur-md border-b border-cyan-500/20 flex items-center justify-between px-4 md:px-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              COSMO
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono mt-1">
               <span className="flex items-center gap-1"><Activity size={12}/> {formatNumber(currentCps)}/s</span>
            </div>
          </div>
          
          <div className="text-right">
             <div className="text-[10px] md:text-sm text-cyan-500 font-bold uppercase tracking-widest mb-1">Energy</div>
             <div className="text-2xl md:text-4xl font-mono font-bold text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
               {formatNumber(gameState.score)}
             </div>
          </div>
        </header>

        {/* Center Stage */}
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 z-[-1]" style={{ 
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.5
          }} />
          
          <div className="absolute top-0 w-full h-1/3 bg-gradient-to-b from-slate-900 via-transparent to-transparent opacity-50 pointer-events-none" />

          {/* The Crystal - pushed up slightly on mobile to make room for chart */}
          <div className="mb-4 md:mb-12 z-10">
             <CoreCrystal onInteract={handleCoreClick} cps={currentCps} />
          </div>

          {/* Chart Section (Bottom Panel) */}
          <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-slate-950 to-transparent p-4 pointer-events-none">
             <div className="h-full w-full max-w-3xl mx-auto opacity-50 md:opacity-70">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                   <defs>
                     <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Area type="monotone" dataKey="value" stroke="#06b6d4" fillOpacity={1} fill="url(#colorScore)" animationDuration={500} isAnimationActive={false} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Shop */}
      {/* On mobile: takes bottom 45% height. On desktop: takes right side. */}
      <aside className="w-full md:w-96 flex-none h-[45%] md:h-full shadow-2xl z-20 order-last md:order-none">
        <UpgradeShop 
          gameState={gameState} 
          buyClickUpgrade={buyClickUpgrade}
          buyBuilding={buyBuilding}
          formatNumber={formatNumber}
        />
      </aside>
    </div>
  );
};

export default App;