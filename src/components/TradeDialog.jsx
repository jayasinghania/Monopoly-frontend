import { useState } from 'react';
import { BOARD_SPACES, GROUP_COLORS } from '../utils/board';
import { TOKENS } from '../utils/tokens';

const PLAYER_COLORS = ['#E63946', '#457B9D', '#2A9D8F', '#E9C46A', '#F4A261', '#9B5DE5'];

// ============================================================
// TRADE PROPOSAL FORM
// ============================================================
export function TradeProposer({ gameState, myIndex, sendMessage, onClose }) {
  const [targetPlayer, setTargetPlayer] = useState(-1);
  const [offerProps, setOfferProps] = useState([]);
  const [offerMoney, setOfferMoney] = useState(0);
  const [requestProps, setRequestProps] = useState([]);
  const [requestMoney, setRequestMoney] = useState(0);

  const me = gameState.players[myIndex];
  const tradeable = gameState.players
    .map((p, i) => ({ ...p, index: i }))
    .filter((p) => p.index !== myIndex && !p.bankrupt);

  const myProps = Object.entries(gameState.properties)
    .filter(([_, p]) => p.owner === myIndex && p.houses === 0)
    .map(([id, p]) => ({ ...BOARD_SPACES[Number(id)], ...p, propId: Number(id) }));

  const theirProps = targetPlayer >= 0
    ? Object.entries(gameState.properties)
        .filter(([_, p]) => p.owner === targetPlayer && p.houses === 0)
        .map(([id, p]) => ({ ...BOARD_SPACES[Number(id)], ...p, propId: Number(id) }))
    : [];

  const toggleOffer = (propId) => {
    setOfferProps((prev) =>
      prev.includes(propId) ? prev.filter((id) => id !== propId) : [...prev, propId]
    );
  };

  const toggleRequest = (propId) => {
    setRequestProps((prev) =>
      prev.includes(propId) ? prev.filter((id) => id !== propId) : [...prev, propId]
    );
  };

  const submit = () => {
    if (targetPlayer < 0) return;
    sendMessage({
      type: 'proposeTrade',
      toPlayer: targetPlayer,
      offerProperties: offerProps,
      offerMoney,
      requestProperties: requestProps,
      requestMoney,
    });
    onClose();
  };

  const hasContent = offerProps.length > 0 || offerMoney > 0 || requestProps.length > 0 || requestMoney > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="card-elevated w-full max-w-lg max-h-[85vh] overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-gold">Propose Trade</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 text-lg">✕</button>
        </div>

        {/* Select target player */}
        <div className="mb-4">
          <p className="text-[10px] font-display tracking-[0.2em] uppercase text-amber-500/40 mb-2">Trade With</p>
          <div className="flex gap-2 flex-wrap">
            {tradeable.map((p) => (
              <button
                key={p.index}
                onClick={() => { setTargetPlayer(p.index); setRequestProps([]); }}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm
                  ${targetPlayer === p.index
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20'
                  }
                `}
              >
                <span>{TOKENS[p.token]?.emoji}</span>
                <span className="text-white/70 font-body">{p.name}</span>
                <span className="text-[10px] font-mono" style={{ color: PLAYER_COLORS[p.index] }}>
                  ${p.money}
                </span>
              </button>
            ))}
          </div>
        </div>

        {targetPlayer >= 0 && (
          <>
            <div className="gold-line mb-4" />

            {/* Your offer */}
            <div className="mb-4">
              <p className="text-[10px] font-display tracking-[0.2em] uppercase text-green-400/60 mb-2">You Offer</p>

              {/* Money */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-white/40">$</span>
                <input
                  type="number"
                  min="0"
                  max={me.money}
                  value={offerMoney}
                  onChange={(e) => setOfferMoney(Math.min(me.money, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="input-field w-28 text-sm py-2"
                />
                <span className="text-[10px] text-white/20 font-mono">/ ${me.money}</span>
              </div>

              {/* Properties */}
              {myProps.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {myProps.map((p) => {
                    const gc = GROUP_COLORS[p.group];
                    const selected = offerProps.includes(p.propId);
                    return (
                      <button
                        key={p.propId}
                        onClick={() => toggleOffer(p.propId)}
                        className={`
                          text-[10px] px-2 py-1.5 rounded border transition-all font-body
                          ${selected
                            ? 'bg-green-500/15 border-green-500/40 text-green-300'
                            : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/20'
                          }
                        `}
                      >
                        {gc && <span className="inline-block w-2 h-2 rounded-sm mr-1" style={{ background: gc.bg }} />}
                        {p.shortName || p.name}
                        {p.mortgaged && ' [M]'}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[10px] text-white/20 italic">No tradeable properties</p>
              )}
            </div>

            <div className="gold-line mb-4" />

            {/* Your request */}
            <div className="mb-4">
              <p className="text-[10px] font-display tracking-[0.2em] uppercase text-red-400/60 mb-2">You Request</p>

              {/* Money */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-white/40">$</span>
                <input
                  type="number"
                  min="0"
                  max={gameState.players[targetPlayer]?.money || 0}
                  value={requestMoney}
                  onChange={(e) => setRequestMoney(Math.max(0, parseInt(e.target.value) || 0))}
                  className="input-field w-28 text-sm py-2"
                />
                <span className="text-[10px] text-white/20 font-mono">
                  / ${gameState.players[targetPlayer]?.money || 0}
                </span>
              </div>

              {/* Properties */}
              {theirProps.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {theirProps.map((p) => {
                    const gc = GROUP_COLORS[p.group];
                    const selected = requestProps.includes(p.propId);
                    return (
                      <button
                        key={p.propId}
                        onClick={() => toggleRequest(p.propId)}
                        className={`
                          text-[10px] px-2 py-1.5 rounded border transition-all font-body
                          ${selected
                            ? 'bg-red-500/15 border-red-500/40 text-red-300'
                            : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/20'
                          }
                        `}
                      >
                        {gc && <span className="inline-block w-2 h-2 rounded-sm mr-1" style={{ background: gc.bg }} />}
                        {p.shortName || p.name}
                        {p.mortgaged && ' [M]'}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[10px] text-white/20 italic">No tradeable properties</p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={submit}
              disabled={!hasContent}
              className="btn-gold w-full text-sm"
            >
              Propose Trade
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// INCOMING TRADE NOTIFICATION
// ============================================================
export function TradeNotification({ gameState, myIndex, sendMessage }) {
  const trade = gameState?.pendingTrade;
  if (!trade) return null;

  const isForMe = trade.to === myIndex;
  const isFromMe = trade.from === myIndex;
  if (!isForMe && !isFromMe) return null;

  const fromPlayer = gameState.players[trade.from];
  const toPlayer = gameState.players[trade.to];

  const renderProps = (propIds) =>
    propIds.map((id) => {
      const space = BOARD_SPACES[id];
      const gc = GROUP_COLORS[space?.group];
      return (
        <span key={id} className="inline-flex items-center gap-1 text-xs text-white/60 bg-white/5 px-2 py-0.5 rounded mr-1 mb-1">
          {gc && <span className="w-2 h-2 rounded-sm" style={{ background: gc.bg }} />}
          {space?.shortName || space?.name}
        </span>
      );
    });

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-fade-in-up">
      <div className="card-elevated p-4">
        <p className="text-xs font-display text-amber-400 mb-2 tracking-wider uppercase">
          {isForMe ? `${fromPlayer.name} wants to trade with you` : `Trade sent to ${toPlayer.name}`}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Offer side */}
          <div>
            <p className="text-[9px] uppercase text-green-400/50 tracking-wider mb-1">
              {isForMe ? 'They offer' : 'You offer'}
            </p>
            {trade.offerProperties.length > 0 && (
              <div className="flex flex-wrap">{renderProps(trade.offerProperties)}</div>
            )}
            {trade.offerMoney > 0 && (
              <span className="text-sm text-green-400 font-mono">${trade.offerMoney}</span>
            )}
            {trade.offerProperties.length === 0 && trade.offerMoney === 0 && (
              <span className="text-[10px] text-white/20">Nothing</span>
            )}
          </div>

          {/* Request side */}
          <div>
            <p className="text-[9px] uppercase text-red-400/50 tracking-wider mb-1">
              {isForMe ? 'They want' : 'You want'}
            </p>
            {trade.requestProperties.length > 0 && (
              <div className="flex flex-wrap">{renderProps(trade.requestProperties)}</div>
            )}
            {trade.requestMoney > 0 && (
              <span className="text-sm text-red-400 font-mono">${trade.requestMoney}</span>
            )}
            {trade.requestProperties.length === 0 && trade.requestMoney === 0 && (
              <span className="text-[10px] text-white/20">Nothing</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isForMe && (
            <>
              <button
                onClick={() => sendMessage({ type: 'acceptTrade' })}
                className="flex-1 text-xs py-2 bg-green-500/15 text-green-400 border border-green-500/30 rounded hover:bg-green-500/25 transition-colors font-display tracking-wider uppercase"
              >
                Accept
              </button>
              <button
                onClick={() => sendMessage({ type: 'rejectTrade' })}
                className="flex-1 text-xs py-2 bg-red-500/15 text-red-400 border border-red-500/30 rounded hover:bg-red-500/25 transition-colors font-display tracking-wider uppercase"
              >
                Reject
              </button>
            </>
          )}
          {isFromMe && (
            <button
              onClick={() => sendMessage({ type: 'cancelTrade' })}
              className="flex-1 text-xs py-2 bg-white/5 text-white/40 border border-white/10 rounded hover:bg-white/10 transition-colors font-display tracking-wider uppercase"
            >
              Cancel Trade
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
