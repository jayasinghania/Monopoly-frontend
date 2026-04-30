import { useState, useEffect } from 'react';
import { TOKENS } from '../utils/tokens';
import { BOARD_SPACES, GROUP_COLORS } from '../utils/board';

const PLAYER_COLORS = ['#E63946', '#457B9D', '#2A9D8F', '#E9C46A', '#F4A261', '#9B5DE5'];

const RANK_LABELS = ['🏆', '🥈', '🥉', '4th', '5th', '6th'];
const RANK_STYLES = [
  'from-amber-500/20 to-amber-700/10 border-amber-500/40',
  'from-gray-300/10 to-gray-500/5 border-gray-400/30',
  'from-orange-600/10 to-orange-800/5 border-orange-500/20',
  'from-white/5 to-white/[0.02] border-white/10',
  'from-white/5 to-white/[0.02] border-white/10',
  'from-white/5 to-white/[0.02] border-white/10',
];

export default function GameOverScreen({ gameState, myIndex, scores }) {
  const [revealed, setRevealed] = useState(0);

  // Stagger reveal animation
  useEffect(() => {
    if (!scores) return;
    const timers = scores.map((_, i) =>
      setTimeout(() => setRevealed((r) => r + 1), 300 + i * 400)
    );
    return () => timers.forEach(clearTimeout);
  }, [scores]);

  if (!scores || scores.length === 0) return null;

  const winner = scores[0];
  const me = scores.find((s) => s.index === myIndex);
  const myRank = scores.findIndex((s) => s.index === myIndex) + 1;

  // Calculate property details per player
  const getPlayerPropertyDetails = (playerIndex) => {
    if (!gameState) return { count: 0, value: 0, houses: 0, hotels: 0 };
    let count = 0, value = 0, houses = 0, hotels = 0;
    for (const [propId, prop] of Object.entries(gameState.properties)) {
      if (prop.owner === playerIndex) {
        count++;
        const space = BOARD_SPACES[Number(propId)];
        value += space?.price || 0;
        if (prop.houses === 5) {
          hotels++;
          value += (space?.houseCost || 0) * 5;
        } else if (prop.houses > 0) {
          houses += prop.houses;
          value += (space?.houseCost || 0) * prop.houses;
        }
      }
    }
    return { count, value, houses, hotels };
  };

  return (
    <div className="min-h-screen bg-main bg-felt-texture flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background confetti-like circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-[0.03]"
            style={{
              width: 40 + Math.random() * 200,
              height: 40 + Math.random() * 200,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: PLAYER_COLORS[i % PLAYER_COLORS.length],
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="text-6xl block mb-3">🏆</span>
          <h1 className="font-display text-4xl font-black">
            <span className="text-gold text-glow">GAME OVER</span>
          </h1>
          <div className="gold-line-strong mt-4 max-w-[160px] mx-auto" />
        </div>

        {/* Winner spotlight */}
        <div className="card-elevated deco-corners p-6 mb-6 text-center animate-fade-in-up delay-1">
          <p className="text-[10px] font-display tracking-[0.3em] uppercase text-amber-500/50 mb-2">Winner</p>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
              style={{
                background: `${PLAYER_COLORS[winner.index]}20`,
                border: `2px solid ${PLAYER_COLORS[winner.index]}50`,
                boxShadow: `0 0 30px ${PLAYER_COLORS[winner.index]}15`,
              }}
            >
              {TOKENS[winner.token]?.emoji || '🎩'}
            </div>
            <div className="text-left">
              <h2 className="font-display text-2xl font-bold text-white">
                {winner.name}
                {winner.index === myIndex && (
                  <span className="text-sm text-amber-400 ml-2">(You!)</span>
                )}
              </h2>
              <p className="font-display text-xl text-gold font-bold">
                ${winner.netWorth.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Winner breakdown */}
          {(() => {
            const details = getPlayerPropertyDetails(winner.index);
            return (
              <div className="flex justify-center gap-6 text-xs text-white/40 font-body">
                <span>💵 ${winner.money.toLocaleString()} cash</span>
                <span>🏠 {details.count} properties</span>
                {details.houses > 0 && <span>🏘️ {details.houses} houses</span>}
                {details.hotels > 0 && <span>🏨 {details.hotels} hotels</span>}
              </div>
            );
          })()}
        </div>

        {/* Full rankings */}
        <div className="space-y-2 mb-6">
          {scores.map((score, rank) => {
            const details = getPlayerPropertyDetails(score.index);
            const isMe = score.index === myIndex;
            const show = rank < revealed;

            return (
              <div
                key={score.index}
                className={`
                  rounded-lg border p-4 transition-all duration-500
                  bg-gradient-to-r ${RANK_STYLES[rank] || RANK_STYLES[3]}
                  ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  ${isMe ? 'ring-1 ring-amber-500/20' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="w-10 text-center flex-shrink-0">
                    <span className={`text-lg ${rank === 0 ? 'text-2xl' : ''}`}>
                      {RANK_LABELS[rank]}
                    </span>
                  </div>

                  {/* Token */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{
                      background: `${PLAYER_COLORS[score.index]}15`,
                      border: `1px solid ${PLAYER_COLORS[score.index]}30`,
                    }}
                  >
                    {TOKENS[score.token]?.emoji || '?'}
                  </div>

                  {/* Name + status */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-body text-sm text-white/80 font-medium truncate">
                        {score.name}
                      </span>
                      {isMe && (
                        <span className="text-[8px] px-1 py-0.5 bg-amber-500/15 text-amber-400 rounded font-mono border border-amber-500/20">
                          you
                        </span>
                      )}
                      {score.bankrupt && (
                        <span className="text-[8px] px-1 py-0.5 bg-red-500/15 text-red-400 rounded font-mono border border-red-500/20">
                          bankrupt
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 text-[10px] text-white/30 font-body mt-0.5">
                      <span>💵 ${score.money.toLocaleString()}</span>
                      <span>🏠 {details.count} props</span>
                      {details.houses > 0 && <span>{details.houses}H</span>}
                      {details.hotels > 0 && <span>{details.hotels}🏨</span>}
                    </div>
                  </div>

                  {/* Net worth */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-display font-bold text-sm" style={{ color: PLAYER_COLORS[score.index] }}>
                      ${score.netWorth.toLocaleString()}
                    </p>
                    <p className="text-[9px] text-white/20 font-mono">net worth</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Your result message */}
        <div className="text-center animate-fade-in-up delay-5">
          <div className="card p-4 inline-block">
            {myRank === 1 ? (
              <p className="text-amber-400 font-display text-lg">
                Congratulations! You're the tycoon! 🎉
              </p>
            ) : myRank === 2 ? (
              <p className="text-gray-300 font-display text-lg">
                So close! Runner-up with ${me?.netWorth.toLocaleString()} 💪
              </p>
            ) : (
              <p className="text-white/50 font-display text-lg">
                You finished #{myRank} with ${me?.netWorth.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <button
            onClick={() => window.location.reload()}
            className="btn-gold text-sm"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
