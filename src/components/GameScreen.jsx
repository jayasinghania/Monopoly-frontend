import { useState, useEffect, useRef } from 'react';
import { TOKENS } from '../utils/tokens';
import { BOARD_SPACES, GROUP_COLORS, getBoardPosition } from '../utils/board';
import BoardSquare from './BoardSquare';
import DiceDisplay from './DiceDisplay';
import PlayerPanel from './PlayerPanel';
import GameLog from './GameLog';
import CardModal from './CardModal';

const PLAYER_COLORS = ['#E63946', '#457B9D', '#2A9D8F', '#E9C46A', '#F4A261', '#9B5DE5'];

export default function GameScreen({ gameState, myIndex, sendMessage, logs }) {
  const [lastCard, setLastCard] = useState(null);
  const [diceAnimating, setDiceAnimating] = useState(false);

  if (!gameState) return null;

  const me = gameState.players[myIndex];
  const isMyTurn = gameState.currentTurn === myIndex;
  const currentPlayer = gameState.players[gameState.currentTurn];

  const canRoll = isMyTurn && !me.hasRolled && !me.pendingAction;
  const canEndTurn = isMyTurn && me.hasRolled && !me.pendingAction;
  const canBuy = isMyTurn && me.pendingAction === 'buy';

  const currentSpace = BOARD_SPACES[me.position];

  const rollDice = () => {
    setDiceAnimating(true);
    sendMessage({ type: 'rollDice' });
    setTimeout(() => setDiceAnimating(false), 800);
  };

  return (
    <div className="min-h-screen bg-main bg-felt-texture flex flex-col lg:flex-row">
      {/* Left sidebar — player info */}
      <div className="lg:w-64 xl:w-72 p-4 flex flex-col gap-3 lg:h-screen lg:overflow-y-auto">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-gold font-display text-lg font-bold">Players</span>
          <div className="flex-1 gold-line" />
        </div>
        {gameState.players.map((player, i) => (
          <PlayerPanel
            key={i}
            player={player}
            index={i}
            isCurrentTurn={gameState.currentTurn === i}
            isMe={i === myIndex}
            color={PLAYER_COLORS[i]}
            properties={gameState.properties}
          />
        ))}
      </div>

      {/* Center — Board */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0">
        {/* Turn indicator */}
        <div className="mb-3 text-center animate-fade-in">
          <span className={`
            inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-body
            ${isMyTurn
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'bg-white/5 text-white/40 border border-white/10'
            }
          `}>
            <span className="text-lg">{currentPlayer?.token ? TOKENS[currentPlayer.token]?.emoji : '❓'}</span>
            {isMyTurn ? "Your turn" : `${currentPlayer?.name}'s turn`}
          </span>
        </div>

        {/* Board */}
        <div className="relative w-full max-w-[640px] aspect-square">
          <div
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: '1.4fr repeat(9, 1fr) 1.4fr',
              gridTemplateRows: '1.4fr repeat(9, 1fr) 1.4fr',
              gap: '1px',
              background: 'rgba(197,165,90,0.15)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {BOARD_SPACES.map((space) => {
              const pos = getBoardPosition(space.id);
              const prop = gameState.properties[space.id];
              const playersHere = gameState.players
                .map((p, i) => ({ ...p, index: i, color: PLAYER_COLORS[i] }))
                .filter((p) => p.position === space.id && !p.bankrupt);

              return (
                <BoardSquare
                  key={space.id}
                  space={space}
                  pos={pos}
                  property={prop}
                  playersHere={playersHere}
                  ownerColor={prop ? PLAYER_COLORS[prop.owner] : null}
                />
              );
            })}

            {/* Center area */}
            <div
              style={{
                gridColumn: '2 / 11',
                gridRow: '2 / 11',
                background: 'linear-gradient(135deg, rgba(12,26,18,0.95), rgba(20,40,28,0.9))',
              }}
              className="flex flex-col items-center justify-center p-4 relative"
            >
              {/* Dice */}
              <DiceDisplay dice={gameState.diceRoll} animating={diceAnimating} />

              {/* Action buttons */}
              <div className="mt-4 flex flex-col items-center gap-2">
                {/* Jail options */}
                {isMyTurn && me.inJail && !me.hasRolled && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button onClick={rollDice} className="btn-gold text-xs px-4 py-2">
                      🎲 Roll for Doubles
                    </button>
                    <button
                      onClick={() => sendMessage({ type: 'payJailFine' })}
                      className="btn-outline text-xs px-4 py-2"
                    >
                      Pay $50 Bail
                    </button>
                    {me.hasGetOutOfJailCard && (
                      <button
                        onClick={() => sendMessage({ type: 'useJailCard' })}
                        className="btn-outline text-xs px-4 py-2"
                      >
                        🃏 Use Card
                      </button>
                    )}
                  </div>
                )}

                {/* Normal roll */}
                {canRoll && !me.inJail && (
                  <button onClick={rollDice} className="btn-gold text-sm px-8 py-3">
                    🎲 Roll Dice
                  </button>
                )}

                {/* Buy property */}
                {canBuy && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => sendMessage({ type: 'buyProperty' })}
                      className="btn-gold text-xs px-4 py-2"
                    >
                      Buy ${currentSpace?.price}
                    </button>
                    <button
                      onClick={() => sendMessage({ type: 'skipBuy' })}
                      className="btn-outline text-xs px-4 py-2"
                    >
                      Skip
                    </button>
                  </div>
                )}

                {/* End turn */}
                {canEndTurn && (
                  <button
                    onClick={() => sendMessage({ type: 'endTurn' })}
                    className="btn-outline text-xs px-6 py-2"
                  >
                    End Turn →
                  </button>
                )}
              </div>

              {/* Current space info */}
              {isMyTurn && me.hasRolled && !me.pendingAction && (
                <div className="mt-3 text-center">
                  <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider">Landed on</p>
                  <p className="text-white/70 text-sm font-display">{currentSpace?.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar — Game Log */}
      <div className="lg:w-64 xl:w-72 p-4 lg:h-screen flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gold font-display text-lg font-bold">Game Log</span>
          <div className="flex-1 gold-line" />
        </div>
        <GameLog logs={logs} />

        {/* My money */}
        <div className="mt-3 card p-3">
          <p className="text-[10px] font-display tracking-[0.2em] uppercase text-amber-500/40">Your Balance</p>
          <p className="text-2xl font-display font-bold text-gold mt-1">
            ${me.money.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Card modal */}
      {gameState.lastCard && (
        <CardModal
          card={gameState.lastCard}
          onDismiss={() => sendMessage({ type: 'dismissCard' })}
        />
      )}
    </div>
  );
}
