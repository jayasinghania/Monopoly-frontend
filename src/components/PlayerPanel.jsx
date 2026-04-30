import { TOKENS } from '../utils/tokens';
import { BOARD_SPACES, GROUP_COLORS } from '../utils/board';

export default function PlayerPanel({ player, index, isCurrentTurn, isMe, color, properties }) {
  // Gather this player's properties
  const ownedProps = Object.entries(properties)
    .filter(([_, p]) => p.owner === index)
    .map(([id, p]) => ({ ...BOARD_SPACES[id], ...p, id: Number(id) }));

  // Group by color
  const grouped = {};
  ownedProps.forEach((p) => {
    const key = p.group || p.type;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p);
  });

  return (
    <div
      className={`
        card p-3 transition-all duration-300
        ${isCurrentTurn ? 'border-l-2' : ''}
        ${player.bankrupt ? 'opacity-30' : ''}
      `}
      style={{
        borderLeftColor: isCurrentTurn ? color : 'transparent',
      }}
    >
      <div className="flex items-center gap-2.5">
        {/* Token */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: `${color}20`, border: `1px solid ${color}40` }}
        >
          {player.token ? TOKENS[player.token]?.emoji : '❓'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-body font-medium text-white/80 truncate">
              {player.name}
            </span>
            {isMe && (
              <span className="text-[8px] px-1 py-0.5 bg-emerald-500/15 text-emerald-400 rounded font-mono border border-emerald-500/20">
                you
              </span>
            )}
          </div>
          <span className="text-sm font-display font-bold" style={{ color }}>
            ${player.money.toLocaleString()}
          </span>
        </div>

        {/* Turn / Jail indicator */}
        <div className="flex-shrink-0">
          {player.inJail && (
            <span className="text-[10px] px-1.5 py-0.5 bg-red-500/15 text-red-400 rounded font-mono border border-red-500/20">
              JAIL
            </span>
          )}
          {isCurrentTurn && !player.inJail && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
          )}
        </div>
      </div>

      {/* Properties */}
      {Object.keys(grouped).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {Object.entries(grouped).map(([group, props]) => {
            const gc = GROUP_COLORS[group];
            return props.map((p) => (
              <div
                key={p.id}
                className="w-4 h-3 rounded-sm relative"
                style={{
                  background: gc?.bg || '#555',
                  opacity: p.mortgaged ? 0.3 : 1,
                }}
                title={`${p.name}${p.houses > 0 ? ` (${p.houses === 5 ? 'Hotel' : p.houses + 'H'})` : ''}${p.mortgaged ? ' [M]' : ''}`}
              >
                {p.houses > 0 && p.houses < 5 && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full" />
                )}
                {p.houses === 5 && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-red-400 rounded-sm" />
                )}
              </div>
            ));
          })}
          {/* Show railroads/utilities as icons */}
          {ownedProps
            .filter((p) => p.type === 'railroad' || p.type === 'utility')
            .map((p) => (
              <div
                key={p.id}
                className="w-4 h-3 rounded-sm bg-white/10 flex items-center justify-center"
                title={p.name}
              >
                <span className="text-[6px]">{p.type === 'railroad' ? '🚂' : '💡'}</span>
              </div>
            ))}
        </div>
      )}

      {player.bankrupt && (
        <p className="text-[9px] text-red-400/50 font-mono mt-1">BANKRUPT</p>
      )}
    </div>
  );
}
