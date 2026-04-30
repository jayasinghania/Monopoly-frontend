import { BOARD_SPACES, GROUP_COLORS } from '../utils/board';

export default function PropertyManager({ gameState, myIndex, sendMessage, onClose }) {
  if (!gameState) return null;

  const myProps = Object.entries(gameState.properties)
    .filter(([_, p]) => p.owner === myIndex)
    .map(([id, p]) => ({ ...BOARD_SPACES[Number(id)], ...p, propId: Number(id) }));

  if (myProps.length === 0) {
    return (
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm tracking-[0.2em] uppercase text-amber-500/40">Your Properties</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 text-sm">✕</button>
        </div>
        <p className="text-white/30 text-sm font-body">You don't own any properties yet.</p>
      </div>
    );
  }

  // Group properties by color/type
  const grouped = {};
  myProps.forEach((p) => {
    const key = p.group || p.type;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p);
  });

  // Check monopolies
  const hasMonopoly = (group) => {
    if (!group || group === 'railroad' || group === 'utility') return false;
    const groupSpaces = BOARD_SPACES.filter((s) => s.group === group);
    return groupSpaces.every((s) => gameState.properties[s.id]?.owner === myIndex);
  };

  return (
    <div className="card p-4 max-h-[70vh] overflow-y-auto log-scroll">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-sm tracking-[0.2em] uppercase text-amber-500/40">Your Properties</h3>
        <button onClick={onClose} className="text-white/30 hover:text-white/60 text-sm">✕</button>
      </div>

      <div className="space-y-3">
        {Object.entries(grouped).map(([group, props]) => {
          const gc = GROUP_COLORS[group];
          const monopoly = hasMonopoly(group);

          return (
            <div key={group}>
              {/* Group header */}
              <div className="flex items-center gap-2 mb-1.5">
                {gc && (
                  <div className="w-3 h-3 rounded-sm" style={{ background: gc.bg }} />
                )}
                <span className="text-[10px] font-display tracking-wider uppercase text-white/40">
                  {group}
                  {monopoly && <span className="text-amber-400 ml-1">★ MONOPOLY</span>}
                </span>
              </div>

              {/* Properties in group */}
              {props.map((prop) => (
                <div
                  key={prop.propId}
                  className={`
                    px-3 py-2 rounded-lg mb-1 border transition-all
                    ${prop.mortgaged
                      ? 'bg-red-500/5 border-red-500/15 opacity-60'
                      : 'bg-white/[0.02] border-white/[0.06]'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-white/70 font-body truncate">{prop.name}</span>
                      {prop.mortgaged && (
                        <span className="text-[8px] px-1 py-0.5 bg-red-500/20 text-red-400 rounded font-mono">MTG</span>
                      )}
                    </div>
                    <span className="text-[10px] text-white/30 font-mono">${prop.price}</span>
                  </div>

                  {/* Houses display */}
                  {prop.type === 'property' && !prop.mortgaged && (
                    <div className="flex items-center gap-1 mb-1.5">
                      {prop.houses === 5 ? (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-2.5 bg-red-500 rounded-sm" />
                          <span className="text-[9px] text-red-400 font-mono">HOTEL</span>
                        </div>
                      ) : (
                        <>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-sm ${
                                i < prop.houses ? 'bg-green-500' : 'bg-white/10'
                              }`}
                            />
                          ))}
                          <span className="text-[9px] text-white/25 font-mono ml-1">
                            {prop.houses}/5
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-1.5 flex-wrap">
                    {/* Build house */}
                    {prop.type === 'property' && monopoly && !prop.mortgaged && prop.houses < 5 && (
                      <button
                        onClick={() => sendMessage({ type: 'buyHouse', propertyId: prop.propId })}
                        className="text-[9px] px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded hover:bg-green-500/20 transition-colors font-mono"
                      >
                        +🏠 ${prop.houseCost || BOARD_SPACES[prop.propId]?.houseCost || '?'}
                      </button>
                    )}

                    {/* Sell house */}
                    {prop.houses > 0 && (
                      <button
                        onClick={() => sendMessage({ type: 'sellHouse', propertyId: prop.propId })}
                        className="text-[9px] px-2 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded hover:bg-orange-500/20 transition-colors font-mono"
                      >
                        -🏠 +${Math.floor((prop.houseCost || BOARD_SPACES[prop.propId]?.houseCost || 0) / 2)}
                      </button>
                    )}

                    {/* Mortgage */}
                    {!prop.mortgaged && prop.houses === 0 && (
                      <button
                        onClick={() => sendMessage({ type: 'mortgage', propertyId: prop.propId })}
                        className="text-[9px] px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors font-mono"
                      >
                        Mortgage +${Math.floor(prop.price / 2)}
                      </button>
                    )}

                    {/* Unmortgage */}
                    {prop.mortgaged && (
                      <button
                        onClick={() => sendMessage({ type: 'unmortgage', propertyId: prop.propId })}
                        className="text-[9px] px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded hover:bg-blue-500/20 transition-colors font-mono"
                      >
                        Unmortgage -${Math.floor(prop.price / 2 * 1.1)}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
