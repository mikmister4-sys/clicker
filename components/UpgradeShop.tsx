import React from 'react';
import { BUILDINGS } from '../constants';
import { GameState } from '../types';
import * as Icons from 'lucide-react';

interface UpgradeShopProps {
  gameState: GameState;
  buyClickUpgrade: () => void;
  buyBuilding: (buildingId: string) => void;
  formatNumber: (n: number) => string;
}

export const UpgradeShop: React.FC<UpgradeShopProps> = ({ 
  gameState, 
  buyClickUpgrade, 
  buyBuilding, 
  formatNumber 
}) => {
  const clickUpgradeCost = Math.floor(50 * Math.pow(1.7, gameState.clickLevel - 1));
  const canAffordClick = gameState.score >= clickUpgradeCost;

  return (
    <div className="flex flex-col h-full bg-slate-900/80 border-t md:border-t-0 md:border-l border-slate-700 backdrop-blur-sm">
      <div className="p-3 md:p-4 border-b border-slate-700 bg-slate-900/90 sticky top-0 z-10 flex items-center justify-between">
        <h2 className="text-base md:text-lg font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-2">
          <Icons.ShoppingCart size={18} /> Market
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-6">
        {/* Click Upgrades Section */}
        <div>
          <h3 className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 md:mb-3">Core Upgrades</h3>
          <button
            onClick={buyClickUpgrade}
            disabled={!canAffordClick}
            className={`w-full group relative flex items-center justify-between p-3 md:p-4 rounded-xl border transition-all duration-200
              ${canAffordClick 
                ? 'bg-slate-800 border-cyan-500/30 hover:bg-slate-700 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                : 'bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed'}`}
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`p-2 md:p-3 rounded-lg ${canAffordClick ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-600'}`}>
                <Icons.MousePointer2 className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm md:text-base text-slate-100">Signal Booster</div>
                <div className="text-[10px] md:text-xs text-slate-400">Increase manual extraction</div>
              </div>
            </div>
            <div className="text-right">
               <div className="text-[10px] md:text-xs text-slate-500 mb-1">Lvl {gameState.clickLevel}</div>
               <div className={`font-mono font-bold text-sm md:text-base ${canAffordClick ? 'text-yellow-400' : 'text-slate-500'}`}>
                 {formatNumber(clickUpgradeCost)}
               </div>
            </div>
          </button>
        </div>

        {/* Buildings Section */}
        <div>
          <h3 className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 md:mb-3">Automation Fleet</h3>
          <div className="space-y-2 md:space-y-3">
            {BUILDINGS.map((building) => {
              const count = gameState.buildings[building.id] || 0;
              const cost = Math.floor(building.baseCost * Math.pow(1.15, count));
              const canAfford = gameState.score >= cost;
              
              // Dynamically get icon component
              const IconComp = (Icons as any)[building.icon] || Icons.Box;

              return (
                <button
                  key={building.id}
                  onClick={() => buyBuilding(building.id)}
                  disabled={!canAfford}
                  className={`w-full flex items-center justify-between p-2 md:p-3 rounded-lg border transition-all duration-200
                    ${canAfford 
                      ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 hover:border-cyan-500/50' 
                      : 'bg-slate-900/30 border-slate-800/50 opacity-50 grayscale cursor-not-allowed'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`p-2 rounded-md ${canAfford ? 'bg-slate-700 text-indigo-300' : 'bg-slate-800 text-slate-600'}`}>
                        <IconComp size={18} className="md:w-5 md:h-5" />
                      </div>
                      {count > 0 && (
                        <div className="absolute -top-2 -right-2 bg-indigo-600 text-[10px] text-white font-bold px-1.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center border border-slate-900">
                          {count}
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm text-slate-200">{building.name}</div>
                      <div className="text-[10px] text-slate-400">+{formatNumber(building.baseIncome)}/s</div>
                    </div>
                  </div>
                  
                  <div className={`font-mono font-bold text-sm px-2 md:px-3 py-1 rounded ${canAfford ? 'bg-slate-950 text-yellow-400 border border-yellow-500/20' : 'text-slate-600'}`}>
                    {formatNumber(cost)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};