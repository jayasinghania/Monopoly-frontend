import { useState } from 'react';

const DecoStar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block">
    <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill="currentColor" />
  </svg>
);

const DecoDiamond = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="inline-block">
    <rect x="5" y="0" width="7" height="7" rx="1" transform="rotate(45 5 0)" fill="currentColor" />
  </svg>
);

export default function LandingScreen({ onCreateRoom, onJoinRoom }) {
  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [mode, setMode] = useState(null);
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return setError('Enter your name first');
    onCreateRoom(name.trim());
  };

  const handleJoin = () => {
    if (!name.trim()) return setError('Enter your name first');
    if (!joinCode.trim()) return setError('Enter a room code');
    onJoinRoom(name.trim(), joinCode.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-main bg-felt-texture flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 border border-amber-600/[0.04] rounded-full" />
        <div className="absolute bottom-[15%] right-[8%] w-96 h-96 border border-amber-600/[0.03] rounded-full" />
        <div className="absolute top-[40%] right-[15%] w-32 h-32 border border-amber-600/[0.05] rotate-45" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-10 animate-fade-in-up">
          {/* Decorative top line */}
          <div className="flex items-center justify-center gap-3 mb-6 text-amber-600/30">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-600/40" />
            <DecoStar />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-600/40" />
          </div>

          {/* Icon */}
          <div className="relative inline-block mb-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30 rotate-3 hover:rotate-0 transition-transform duration-500">
              <span className="text-4xl -rotate-3">🎩</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-emerald-300 flex items-center justify-center shadow-lg">
              <span className="text-[10px] font-bold text-white">$</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-6xl font-black tracking-tight mb-2">
            <span className="text-gold text-glow">MONOPOLY</span>
          </h1>

          {/* Subtitle */}
          <div className="flex items-center justify-center gap-3 text-amber-600/40 mb-2">
            <div className="w-8 h-px bg-amber-600/30" />
            <DecoDiamond />
            <span className="font-display text-[11px] tracking-[0.35em] uppercase text-amber-500/50 font-medium">
              Real-Time Multiplayer
            </span>
            <DecoDiamond />
            <div className="w-8 h-px bg-amber-600/30" />
          </div>
        </div>

        {/* Main Card */}
        <div className="card-elevated deco-corners p-8 animate-fade-in-up delay-1 relative">
          {/* Shimmer effect */}
          <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/[0.03] to-transparent translate-x-[-200%] animate-[shimmer_4s_linear_infinite]" 
                 style={{ animation: 'shimmer 4s linear infinite' }} />
          </div>

          {/* Name Input */}
          <div className="mb-6 relative z-10">
            <label className="block font-display text-[10px] tracking-[0.25em] uppercase text-amber-500/40 mb-2.5 font-medium">
              Player Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="What should we call you?"
              maxLength={20}
              className="input-field text-lg"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter' && !mode) setMode('create'); }}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm font-body animate-scale-in">
              {error}
            </div>
          )}

          {/* Mode Selection */}
          {!mode && (
            <div className="space-y-3 relative z-10">
              <button onClick={() => setMode('create')} className="btn-gold w-full">
                Create Room
              </button>
              <button onClick={() => setMode('join')} className="btn-outline w-full">
                Join with Code
              </button>
            </div>
          )}

          {/* Create Mode */}
          {mode === 'create' && (
            <div className="space-y-4 animate-fade-in-up relative z-10">
              <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-emerald-400/70 text-sm font-body leading-relaxed">
                  You'll get a <span className="font-semibold text-emerald-300">5-character room code</span> to share with your friends. Up to 6 players can join.
                </p>
              </div>
              <button onClick={handleCreate} className="btn-gold w-full">
                Create & Get Code
              </button>
              <button onClick={() => setMode(null)} className="w-full text-center text-amber-600/30 text-sm hover:text-amber-500/50 transition-colors font-body">
                ← Back
              </button>
            </div>
          )}

          {/* Join Mode */}
          {mode === 'join' && (
            <div className="space-y-4 animate-fade-in-up relative z-10">
              <div>
                <label className="block font-display text-[10px] tracking-[0.25em] uppercase text-amber-500/40 mb-2.5 font-medium">
                  Room Code
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setError(''); }}
                  placeholder="ABCDE"
                  maxLength={5}
                  className="input-field text-center text-3xl font-mono tracking-[0.6em] py-4"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') handleJoin(); }}
                />
              </div>
              <button onClick={handleJoin} className="btn-gold w-full">
                Join Game
              </button>
              <button onClick={() => setMode(null)} className="w-full text-center text-amber-600/30 text-sm hover:text-amber-500/50 transition-colors font-body">
                ← Back
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-fade-in-up delay-3">
          <div className="flex items-center justify-center gap-2 text-amber-600/15 mb-3">
            <div className="w-16 h-px bg-amber-600/15" />
            <DecoDiamond />
            <div className="w-16 h-px bg-amber-600/15" />
          </div>
          <p className="text-[10px] text-amber-600/20 tracking-[0.15em] font-body uppercase">
            React · WebSocket · Server-Authoritative Architecture
          </p>
        </div>
      </div>
    </div>
  );
}
