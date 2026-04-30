const DOTS = {
  1: [[1, 1]],
  2: [[0, 2], [2, 0]],
  3: [[0, 2], [1, 1], [2, 0]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
};

function Die({ value, animating, delay = 0 }) {
  const dots = DOTS[value] || [];

  return (
    <div
      className={`
        w-12 h-12 rounded-lg bg-ivory-dark relative
        shadow-lg shadow-black/30
        ${animating ? '' : ''}
      `}
      style={{
        background: 'linear-gradient(135deg, #f5f0e8, #e8e0d0)',
        animation: animating ? `diceRoll 0.4s ease-out ${delay}s` : undefined,
      }}
    >
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-1.5 gap-0">
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => {
            const hasDot = dots.some(([r, c]) => r === row && c === col);
            return (
              <div key={`${row}-${col}`} className="flex items-center justify-center">
                {hasDot && (
                  <div className="w-2 h-2 rounded-full bg-[#1a2e22] shadow-inner" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function DiceDisplay({ dice, animating }) {
  if (!dice) {
    return (
      <div className="flex gap-3 opacity-30">
        <div className="w-12 h-12 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center">
          <span className="text-white/20 text-lg">?</span>
        </div>
        <div className="w-12 h-12 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center">
          <span className="text-white/20 text-lg">?</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Die value={dice[0]} animating={animating} delay={0} />
      <Die value={dice[1]} animating={animating} delay={0.05} />
    </div>
  );
}
