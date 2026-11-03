import React from 'react';

interface AnalogCalorieGaugeProps {
  consumed: number;
  goal: number;
}

export const AnalogCalorieGauge: React.FC<AnalogCalorieGaugeProps> = ({ consumed, goal }) => {
  const safeGoal = Math.max(1, goal);
  const ratio = consumed / safeGoal;
  const isSurplus = consumed > safeGoal;
  const remaining = Math.max(0, safeGoal - consumed);
  const surplus = Math.max(0, consumed - safeGoal);

  // Map ratio: 0 => -90 deg, 1.0 => +90 deg, clamped at 1.25 => +115 deg
  const clampedRatio = Math.min(1.25, Math.max(0, ratio));
  const needleAngle = -90 + clampedRatio * 180;

  return (
    <div className="relative mx-auto w-full max-w-[340px] p-2">
      {/* Brass Bezel Frame */}
      <div className="brass-bezel-recessed rounded-full p-4 relative overflow-hidden aspect-square flex flex-col items-center justify-center">
        {/* Anti-reflective curved glass highlight reflection */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.04) 40%, transparent 65%)',
          }}
        />

        {/* Outer 4 Brass Screws */}
        <div className="brass-rivet absolute top-2 left-1/2 -translate-x-1/2" />
        <div className="brass-rivet absolute bottom-2 left-1/2 -translate-x-1/2" />
        <div className="brass-rivet absolute left-2 top-1/2 -translate-y-1/2" />
        <div className="brass-rivet absolute right-2 top-1/2 -translate-y-1/2" />

        {/* Gauge SVG Dial Face */}
        <svg viewBox="0 0 200 120" className="w-full mt-2 overflow-visible">
          <defs>
            <linearGradient id="greenArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e824c" />
              <stop offset="100%" stopColor="#27ae60" />
            </linearGradient>
            <linearGradient id="amberArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f39c12" />
              <stop offset="100%" stopColor="#e67e22" />
            </linearGradient>
            <linearGradient id="redArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c0392b" />
              <stop offset="100%" stopColor="#962d22" />
            </linearGradient>
            <filter id="gaugeShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#26221f"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Calibrated Color Zoned Arcs */}
          {/* Green Zone (0% - 80%): ~144 degrees of the 180 arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 152 48"
            fill="none"
            stroke="url(#greenArc)"
            strokeWidth="10"
            strokeLinecap="round"
            filter="url(#gaugeShadow)"
          />

          {/* Amber Zone (80% - 100%): 36 degrees */}
          <path
            d="M 152 48 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#amberArc)"
            strokeWidth="10"
            strokeLinecap="round"
            filter="url(#gaugeShadow)"
          />

          {/* Needle Center Pivot & Gauge Ticks */}
          {[0, 25, 50, 75, 100].map((pct, idx) => {
            const angle = -90 + (pct / 100) * 180;
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + 70 * Math.sin(rad);
            const y1 = 100 - 70 * Math.cos(rad);
            const x2 = 100 + 62 * Math.sin(rad);
            const y2 = 100 - 62 * Math.cos(rad);
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#c89e3a"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          {/* Rotating Brass Needle */}
          <g 
            style={{
              transform: `rotate(${needleAngle}deg)`,
              transformOrigin: '100px 100px',
              transition: 'transform 0.6s cubic-bezier(0.34, 1.3, 0.64, 1)',
            }}
          >
            {/* Needle Body (Tapered) */}
            <polygon
              points="98,100 102,100 101,24 99,24"
              fill="#f5d77f"
              stroke="#553d08"
              strokeWidth="0.8"
              filter="url(#gaugeShadow)"
            />
            {/* Red Needle Tip */}
            <polygon
              points="99,24 101,24 100,16"
              fill="#c0392b"
            />
          </g>

          {/* Center Brass Cap */}
          <circle cx="100" cy="100" r="12" fill="#d4af37" stroke="#3d2b09" strokeWidth="2" />
          <circle cx="100" cy="100" r="8" fill="#fdf0a6" />
          <circle cx="100" cy="100" r="4" fill="#735418" />
        </svg>

        {/* Digital/Mechanical Odometer Readout Box */}
        <div className="bg-[#0e0c0a] border border-[#553d08] rounded px-3 py-1.5 mt-[-10px] text-center shadow-inner z-10 w-44">
          <div className="text-[10px] uppercase tracking-wider text-[#d5c4a1]/70 font-mono">
            Calories Consumed
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#fcf9f1] debossed-text">
            {consumed.toLocaleString()}
          </div>
          <div className="text-[11px] font-medium text-[#c89e3a] flex items-center justify-between border-t border-[#3d2b09] pt-0.5 mt-0.5">
            <span className="text-[#9a9187]">Goal: {goal.toLocaleString()}</span>
            {isSurplus ? (
              <span className="text-[#e74c3c] font-bold">
                <span>+{surplus.toLocaleString()}</span> Surplus
              </span>
            ) : (
              <span className="text-[#2ecc71] font-semibold">
                <span>{remaining.toLocaleString()}</span> Remaining
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
