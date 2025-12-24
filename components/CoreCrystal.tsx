import React, { useState, useCallback } from 'react';

interface CoreCrystalProps {
  onInteract: (x: number, y: number) => void;
  cps: number;
}

export const CoreCrystal: React.FC<CoreCrystalProps> = ({ onInteract, cps }) => {
  const [scale, setScale] = useState(1);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    // Simple recoil animation logic
    setScale(0.92);
    setTimeout(() => setScale(1), 100);
    
    onInteract(e.clientX, e.clientY);
  }, [onInteract]);

  return (
    <div className="relative flex items-center justify-center h-48 w-48 md:h-80 md:w-80 select-none">
      {/* Glow Effect */}
      <div 
        className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" 
        style={{ transform: `scale(${scale * 1.2})` }}
      />
      
      {/* Crystal Shape using Polygon clip-path */}
      <div
        onPointerDown={handlePointerDown}
        className="relative z-10 w-32 h-32 md:w-56 md:h-56 cursor-pointer transition-transform duration-100 ease-in-out group active:filter active:brightness-110"
        style={{
          transform: `scale(${scale})`,
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: 'linear-gradient(135deg, #00d4ff 0%, #0056b3 100%)',
          boxShadow: '0 0 50px rgba(0, 212, 255, 0.6)',
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <span className="text-xl md:text-3xl font-black tracking-widest drop-shadow-md">CORE</span>
          <span className="text-xs md:text-sm font-mono opacity-80 mt-1">Lvl {Math.floor(Math.sqrt(cps) + 1)}</span>
        </div>

        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
};