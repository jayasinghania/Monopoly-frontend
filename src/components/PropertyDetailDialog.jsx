import { BOARD_SPACES, GROUP_COLORS } from '../utils/board';
import { TOKENS } from '../utils/tokens';

// Group definitions — which properties belong to each color group, in board order.
// Used to show "X of Y owned" for each color set.
const GROUP_DEFINITIONS = (() => {
  const groups = {};
  BOARD_SPACES.forEach((space, id) => {
    if (space.type === 'property' && space.group) {
      if (!groups[space.group]) groups[space.group] = [];
      groups[space.group].push(id);
    }
  });
  return groups;
})();

const PLAYER_COLORS = ['#E63946', '#457B9D', '#2A9D8F', '#E9C46A', '#F4A261', '#9B5DE5'];

export default function PropertyDetailDialog({ player, playerIndex, properties, onClose }) {
  const playerColor = PLAYER_COLORS[playerIndex];

  // Owned by this player, joined with board info
  const owned = Object.entries(properties)
    .filter(([_, p]) => p.owner === playerIndex)
    .map(([id, p]) => ({ ...BOARD_SPACES[Number(id)], ...p, id: Number(id) }));

  // Group properties by their color set (for the "color groups" section)
  const byGroup = {};
  owned.filter((p) => p.type === 'property').forEach((p) => {
    if (!byGroup[p.group]) byGroup[p.group] = [];
    byGroup[p.group].push(p);
  });

  const railroads = owned.filter((p) => p.type === 'railroad');
  const utilities = owned.filter((p) => p.type === 'utility');

  // Totals
  const totalMortgageValue = owned.reduce((sum, p) => {
    if (p.mortgaged) return sum;
    return sum + Math.floor((p.price || 0) / 2);
  }, 0);
  const houseCount = owned.reduce((sum, p) => sum + (p.houses === 5 ? 0 : p.houses || 0), 0);
  const hotelCount = owned.filter((p) => p.houses === 5).length;
  const mortgagedCount = owned.filter((p) => p.mortgaged).length;
  const monopolyCount = Object.keys(byGroup).filter(
    (g) => byGroup[g].length === GROUP_DEFINITIONS[g]?.length
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="card-elevated w-full max-w-2xl max-h-[85vh] overflow-y-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
              style={{
                background: `${playerColor}25`,
                border: `1.5px solid ${playerColor}80`,
              }}
            >
              {player.token ? TOKENS[player.token]?.emoji : '❓'}
            </div>
            <div>
              <h3 className="font-display text-lg text-white leading-tight">
                {player.name}
                <span className="text-sm text-white/40 font-body font-normal ml-2">
                  · Holdings
                </span>
              </h3>
              <p className="font-display text-sm font-bold tracking-tight" style={{ color: playerColor }}>
                ${player.money.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/80 text-xl px-2"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="gold-line mb-4" />

        {/* Stat strip */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          <Stat label="Properties" value={owned.length} />
          <Stat label="Monopolies" value={monopolyCount} highlight={monopolyCount > 0} />
          <Stat label="Houses · Hotels" value={`${houseCount} · ${hotelCount}`} />
          <Stat label="Mortgage Value" value={`$${totalMortgageValue}`} />
        </div>

        {/* Empty state */}
        {owned.length === 0 && (
          <div className="text-center py-10">
            <p className="text-white/40 font-body text-sm">No properties owned yet.</p>
          </div>
        )}

        {/* Color group sections */}
        {Object.keys(byGroup).length > 0 && (
          <div className="mb-5">
            <SectionLabel>Color Groups</SectionLabel>
            <div className="space-y-3">
              {Object.entries(byGroup).map(([groupKey, props]) => {
                const gc = GROUP_COLORS[groupKey];
                const totalInGroup = GROUP_DEFINITIONS[groupKey]?.length || props.length;
                const isMonopoly = props.length === totalInGroup;
                return (
                  <div key={groupKey}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className="h-1.5 w-12 rounded-sm"
                        style={{
                          background: gc?.bg || '#555',
                          boxShadow: isMonopoly ? `0 0 8px ${gc?.bg}` : 'none',
                        }}
                      />
                      <span className="text-[11px] uppercase tracking-wider text-white/60 font-mono">
                        {groupKey}
                      </span>
                      <span className={`text-[10px] font-mono ${isMonopoly ? 'text-amber-300 font-bold' : 'text-white/40'}`}>
                        {props.length}/{totalInGroup}{isMonopoly ? ' · MONOPOLY' : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {props.map((p) => (
                        <PropertyCard key={p.id} property={p} groupColor={gc} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Railroads */}
        {railroads.length > 0 && (
          <div className="mb-5">
            <SectionLabel>
              Railroads
              <span className="ml-2 text-white/40">{railroads.length}/4</span>
            </SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {railroads.map((p) => (
                <PropertyCard key={p.id} property={p} icon="🚂" />
              ))}
            </div>
          </div>
        )}

        {/* Utilities */}
        {utilities.length > 0 && (
          <div className="mb-3">
            <SectionLabel>
              Utilities
              <span className="ml-2 text-white/40">{utilities.length}/2</span>
            </SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {utilities.map((p) => (
                <PropertyCard key={p.id} property={p} icon="💡" />
              ))}
            </div>
          </div>
        )}

        {mortgagedCount > 0 && (
          <p className="text-[11px] text-red-300/70 font-mono mt-2 text-center">
            {mortgagedCount} {mortgagedCount === 1 ? 'property is' : 'properties are'} mortgaged
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function Stat({ label, value, highlight }) {
  return (
    <div
      className={`rounded-md p-2 text-center ${
        highlight
          ? 'bg-amber-500/10 border border-amber-400/30'
          : 'bg-white/[0.03] border border-white/[0.06]'
      }`}
    >
      <div className={`text-[9px] uppercase tracking-wider font-mono mb-0.5 ${highlight ? 'text-amber-300/80' : 'text-white/40'}`}>
        {label}
      </div>
      <div className={`text-base font-display font-bold ${highlight ? 'text-amber-300' : 'text-white/90'}`}>
        {value}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-display tracking-[0.2em] uppercase text-amber-500/50 mb-2 flex items-center">
      {children}
    </p>
  );
}

function PropertyCard({ property, groupColor, icon }) {
  const swatchColor = groupColor?.bg || (icon === '🚂' ? '#3a3a3a' : icon === '💡' ? '#6b7280' : '#555');
  const mortgageValue = Math.floor((property.price || 0) / 2);

  return (
    <div
      className={`relative rounded-md p-2.5 border ${
        property.mortgaged
          ? 'bg-red-950/20 border-red-500/20 opacity-70'
          : 'bg-white/[0.03] border-white/[0.08]'
      }`}
    >
      {/* Color stripe on the left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-md"
        style={{ background: swatchColor }}
      />

      <div className="ml-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {icon && <span className="text-xs">{icon}</span>}
            <span className={`text-sm font-body font-medium truncate ${property.mortgaged ? 'line-through text-white/50' : 'text-white/90'}`}>
              {property.name}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-white/40 font-mono">
              ${property.price}
            </span>
            {property.mortgaged ? (
              <span className="text-[10px] text-red-300 font-mono">
                Mortgaged
              </span>
            ) : (
              <span className="text-[10px] text-white/30 font-mono">
                Mortgage value ${mortgageValue}
              </span>
            )}
          </div>
        </div>

        {/* Houses/hotel indicator */}
        {property.houses > 0 && property.houses < 5 && (
          <div className="flex gap-0.5 flex-shrink-0 mt-0.5">
            {Array.from({ length: property.houses }).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 bg-green-400 rounded-sm shadow-sm shadow-green-500/50" />
            ))}
          </div>
        )}
        {property.houses === 5 && (
          <div
            className="w-4 h-4 bg-red-500 rounded-sm flex-shrink-0 mt-0.5 shadow-sm shadow-red-500/60"
            title="Hotel"
          />
        )}
        {property.mortgaged && (
          <div className="text-[10px] font-mono text-red-300/70 flex-shrink-0">
            +${mortgageValue}
          </div>
        )}
      </div>
    </div>
  );
}