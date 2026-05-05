import { TOKENS } from '../utils/tokens';
import { BOARD_SPACES, GROUP_COLORS } from '../utils/board';

export default function PlayerPanel({ player, index, isCurrentTurn, isMe, color, properties, onViewProperties }) {
  // Gather this player's properties
  const ownedProps = Object.entries(properties)
    .filter(([_, p]) => p.owner === index)
    .map(([id, p]) => ({ ...BOARD_SPACES[id], ...p, id: Number(id) }));

  // Sort by group so same-color props sit together
  ownedProps.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'property' ? -1 : 1;
    if (a.group && b.group && a.group !== b.group) return a.group.localeCompare(b.group);
    return a.id - b.id;
  });

  // How many chips fit in the preview before we say "+N more"
  const PREVIEW_LIMIT = 4;
  const previewProps = ownedProps.slice(0, PREVIEW_LIMIT);
  const overflow = ownedProps.length - previewProps.length;

  return (
    <div
      className={`
        ${isMe ? 'card-me' : 'card'} p-3 transition-all duration-300
        ${isCurrentTurn ? 'ring-2 ring-offset-0' : ''}
        ${player.bankrupt ? 'opacity-30' : ''}
      `}
      style={{
        ...(isCurrentTurn && { '--tw-ring-color': color }),
        borderRadius: 8,
      }}
    >
      <div className="flex items-center gap-2.5">
        {/* Token */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
          style={{
            background: `${color}25`,
            border: `1.5px solid ${color}80`,
            boxShadow: isCurrentTurn ? `0 0 12px ${color}60` : 'none',
          }}
        >
          {player.token ? TOKENS[player.token]?.emoji : '❓'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-body font-semibold text-white truncate">
              {player.name}
            </span>
            {isMe && (
              <span className="text-[10px] px-1.5 py-0.5 bg-violet-500/25 text-violet-200 rounded font-mono border border-violet-400/40 font-semibold">
                YOU
              </span>
            )}
          </div>
          <span className="text-base font-display font-bold tracking-tight" style={{ color }}>
            ${player.money.toLocaleString()}
          </span>
        </div>

        {/* Turn / Jail indicator */}
        <div className="flex-shrink-0">
          {player.inJail && (
            <span className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-300 rounded font-mono border border-red-500/30 font-semibold">
              JAIL
            </span>
          )}
          {isCurrentTurn && !player.inJail && (
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse inline-block shadow-md shadow-amber-500/60" />
          )}
        </div>
      </div>

      {/* Owned properties — preview chips + "View All" button to open the full modal */}
      {ownedProps.length > 0 && (
        <div className="mt-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono">
              Properties
              <span className="text-white/70 font-semibold ml-1.5">{ownedProps.length}</span>
            </span>
            {onViewProperties && (
              <button
                onClick={() => onViewProperties(index)}
                className="text-[10px] px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/50 transition-colors font-display tracking-wider uppercase"
              >
                View All
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {previewProps.map((p) => {
              const gc = GROUP_COLORS[p.group];
              const swatchColor = gc?.bg || (p.type === 'railroad' ? '#3a3a3a' : p.type === 'utility' ? '#6b7280' : '#555');
              const label = p.shortName || p.name;
              return (
                <span
                  key={p.id}
                  className={`prop-chip ${p.mortgaged ? 'prop-chip-mortgaged' : ''}`}
                  title={`${p.name}${p.houses > 0 ? ` — ${p.houses === 5 ? 'Hotel' : `${p.houses} house${p.houses > 1 ? 's' : ''}`}` : ''}${p.mortgaged ? ' (mortgaged)' : ''}`}
                >
                  <span className="prop-chip-swatch" style={{ background: swatchColor }} />
                  <span>
                    {p.type === 'railroad' ? '🚂 ' : p.type === 'utility' ? '💡 ' : ''}
                    {label}
                  </span>
                  {p.houses > 0 && p.houses < 5 && (
                    <span className="text-green-300 font-mono">·{p.houses}H</span>
                  )}
                  {p.houses === 5 && (
                    <span className="text-red-300 font-mono">·HOTEL</span>
                  )}
                </span>
              );
            })}
            {overflow > 0 && (
              <button
                onClick={() => onViewProperties?.(index)}
                className="prop-chip text-amber-300/80 hover:text-amber-200 border-amber-500/20 hover:border-amber-400/40 cursor-pointer"
                style={{ background: 'rgba(212,175,55,0.08)' }}
                title="See all properties"
              >
                +{overflow} more
              </button>
            )}
          </div>
        </div>
      )}

      {player.bankrupt && (
        <p className="text-[11px] text-red-300 font-mono mt-1.5 font-semibold tracking-wider">BANKRUPT</p>
      )}
    </div>
  );
}