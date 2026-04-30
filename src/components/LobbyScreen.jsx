import { useState } from 'react';
import { TOKENS } from '../utils/tokens';

export default function LobbyScreen({ gameState, myIndex, sendMessage }) {
  const [copied, setCopied] = useState(false);

  if (!gameState) return null;

  const me = gameState.players[myIndex];
  const isHost = me?.id === gameState.hostId;
  const allReady = gameState.players.every((p) => p.ready);
  const canStart = isHost && allReady && gameState.players.length >= 2;

  const copyCode = () => {
    navigator.clipboard.writeText(gameState.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectToken = (token) => sendMessage({ type: 'selectToken', token });
  const toggleReady = () => sendMessage({ type: 'toggleReady' });
  const startGame = () => sendMessage({ type: 'startGame' });

  const takenTokens = gameState.players
    .filter((p, i) => i !== myIndex && p.token)
    .map((p) => p.token);

  return (
    <div className="min-h-screen bg-main bg-felt-texture flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl relative z-10">

        {/* Header */}
        <div className="text-center mb-6 animate-fade-in-up">
          <p className="font-display text-[10px] tracking-[0.4em] uppercase text-amber-500/40 mb-1">Waiting Room</p>
          <h1 className="font-display text-3xl font-bold">
            <span className="text-gold">Game Lobby</span>
          </h1>
          <div className="gold-line-strong mt-3 max-w-[120px] mx-auto" />
        </div>

        {/* Room Code Banner */}
        <div className="card-elevated p-5 mb-6 animate-fade-in-up delay-1">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <span className="text-lg">🔗</span>
              </div>
              <div>
                <p className="text-[10px] font-display tracking-[0.2em] uppercase text-amber-500/40">Share This Code</p>
                <p className="font-mono text-2xl tracking-[0.5em] text-amber-400 font-bold mt-0.5">
                  {gameState.code}
                </p>
              </div>
            </div>
            <button
              onClick={copyCode}
              className="btn-outline px-5 py-2.5 text-xs flex items-center gap-2"
            >
              {copied ? (
                <><span className="text-emerald-400">✓</span> Copied</>
              ) : (
                <><span>📋</span> Copy Code</>
              )}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-6">

          {/* Token Selection — 2 cols */}
          <div className="md:col-span-2 card p-5 animate-fade-in-up delay-2">
            <h2 className="font-display text-[10px] tracking-[0.25em] uppercase text-amber-500/40 mb-4 font-medium">
              Pick Your Token
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {Object.entries(TOKENS).map(([key, token]) => {
                const isMine = me?.token === key;
                const isTaken = takenTokens.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => !isTaken && selectToken(key)}
                    disabled={isTaken}
                    className={`
                      group relative flex flex-col items-center gap-1.5 p-3.5 rounded-lg transition-all duration-200
                      ${isMine
                        ? 'bg-amber-500/10 border-2 border-amber-500/40 shadow-lg shadow-amber-900/20'
                        : isTaken
                          ? 'bg-white/[0.02] border border-white/[0.04] opacity-25 cursor-not-allowed'
                          : 'bg-white/[0.02] border border-white/[0.06] hover:bg-amber-500/5 hover:border-amber-500/20 cursor-pointer'
                      }
                    `}
                  >
                    <span className={`text-2xl transition-transform duration-300 ${isMine ? 'animate-float scale-110' : 'group-hover:scale-110'}`}>
                      {token.emoji}
                    </span>
                    <span className={`text-[10px] font-body ${isMine ? 'text-amber-400' : 'text-white/40'}`}>
                      {token.label}
                    </span>
                    {isMine && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center animate-scale-in">
                        <span className="text-[10px] text-black font-bold">✓</span>
                      </div>
                    )}
                    {isTaken && !isMine && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] text-red-400/50 font-mono bg-black/30 px-2 py-0.5 rounded">taken</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Players List — 3 cols */}
          <div className="md:col-span-3 card p-5 animate-fade-in-up delay-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-[10px] tracking-[0.25em] uppercase text-amber-500/40 font-medium">
                Players
              </h2>
              <span className="text-[11px] font-mono text-amber-500/30">
                {gameState.players.length}/6
              </span>
            </div>

            <div className="space-y-2">
              {gameState.players.map((player, i) => (
                <div
                  key={i}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${i === myIndex
                      ? 'bg-amber-500/8 border border-amber-500/15'
                      : 'bg-white/[0.02] border border-white/[0.04]'
                    }
                    ${!player.connected ? 'opacity-30' : ''}
                  `}
                >
                  {/* Token */}
                  <div className="w-9 h-9 rounded-lg bg-black/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{player.token ? TOKENS[player.token]?.emoji : '❓'}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-body text-sm text-white/90 truncate font-medium">
                        {player.name}
                      </span>
                      {player.id === gameState.hostId && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/15 text-amber-400 rounded font-mono uppercase tracking-wider border border-amber-500/20">
                          host
                        </span>
                      )}
                      {i === myIndex && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 rounded font-mono border border-emerald-500/20">
                          you
                        </span>
                      )}
                    </div>
                    {!player.connected && (
                      <span className="text-[10px] text-red-400/50 font-body">reconnecting...</span>
                    )}
                  </div>

                  {/* Ready indicator */}
                  <div className={`
                    flex-shrink-0 w-20 h-8 rounded flex items-center justify-center text-[10px] font-display tracking-wider uppercase transition-all duration-300
                    ${player.ready
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/[0.03] text-white/15 border border-white/[0.06]'
                    }
                  `}>
                    {player.ready ? '✓ Ready' : 'Waiting'}
                  </div>
                </div>
              ))}

              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 2 - gameState.players.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-white/[0.05]"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.02] flex items-center justify-center flex-shrink-0">
                    <span className="text-white/10">·</span>
                  </div>
                  <span className="text-[11px] text-white/10 font-body italic">Waiting for player...</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-6 card p-4 animate-fade-in-up delay-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Status message */}
            <div className="text-sm font-body text-white/30">
              {!me?.token ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500/50 animate-pulse" />
                  Pick a token to continue
                </span>
              ) : !me?.ready ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500/50 animate-pulse" />
                  Ready up when you're set
                </span>
              ) : !allReady ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse" />
                  Waiting for others...
                </span>
              ) : isHost ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Everyone's ready — start the game!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Waiting for host to start...
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={toggleReady}
                disabled={!me?.token}
                className={me?.ready ? 'btn-outline px-6 py-2.5 text-xs' : 'btn-gold px-6 py-2.5 text-xs'}
              >
                {!me?.token ? 'Pick Token First' : me?.ready ? 'Unready' : 'Ready Up'}
              </button>

              {isHost && (
                <button
                  onClick={startGame}
                  disabled={!canStart}
                  className="btn-gold px-6 py-2.5 text-xs"
                >
                  Start Game →
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
