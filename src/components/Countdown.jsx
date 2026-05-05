import { useEffect, useState } from 'react';

/**
 * Three-two-one countdown shown when the game is about to start.
 * Calls onComplete after the sequence finishes.
 *
 * Each number is held for ~800ms. Total runtime: ~2.6s.
 */
export default function Countdown({ onComplete }) {
  const [n, setN] = useState(3);

  useEffect(() => {
    const tick = (next) => setTimeout(() => setN(next), 800);
    const t1 = tick(2);
    const t2 = setTimeout(() => setN(1), 1600);
    const t3 = setTimeout(() => setN(0), 2400); // "GO" frame
    const t4 = setTimeout(() => onComplete?.(), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const label = n === 0 ? 'GO' : String(n);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(15,45,25,0.92) 0%, rgba(6,18,12,0.98) 70%)',
        backdropFilter: 'blur(8px)',
      }}
      aria-live="assertive"
      aria-atomic="true"
    >
      {/* Decorative ring — sits behind the digit */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-20 animate-spin"
        style={{
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderTopColor: 'transparent',
          animationDuration: '6s',
        }}
      />
      <div
        className="absolute w-[320px] h-[320px] rounded-full opacity-15"
        style={{ border: '1px dashed rgba(212, 175, 55, 0.5)' }}
      />

      <div
        key={n}
        className="relative font-display font-bold select-none"
        style={{
          fontSize: n === 0 ? '180px' : '240px',
          background:
            'linear-gradient(180deg, #f5d76e 0%, #d4af37 45%, #b8930b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 60px rgba(212, 175, 55, 0.6)',
          filter: 'drop-shadow(0 4px 30px rgba(212, 175, 55, 0.4))',
          animation: 'countdownPop 800ms ease-out',
          letterSpacing: n === 0 ? '0.05em' : '0',
        }}
      >
        {label}
      </div>

      {/* Subtitle */}
      <div className="absolute bottom-[20%] text-center">
        <p className="font-display tracking-[0.4em] text-amber-300/60 text-sm uppercase">
          {n === 0 ? 'Roll the dice' : 'Game starting'}
        </p>
      </div>

      <style>{`
        @keyframes countdownPop {
          0%   { transform: scale(0.3); opacity: 0; }
          50%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}