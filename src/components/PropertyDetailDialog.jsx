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

const PLAYER_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#A855F7', '#EC4899', '#06B6D4'];

export default function PropertyDetailDialog({ player, playerIndex, properties, myIndex, sendMessage, onClose }) {
  const playerColor = PLAYER_COLORS[playerIndex];

  // Are we looking at our OWN holdings? Only then are action buttons shown.
  const isOwn = myIndex === playerIndex;

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

  // Which color groups does this player have a full monopoly on?
  // Only properties in a complete monopoly can have houses built on them.
  const completedGroups = new Set(
    Object.keys(byGroup).filter(
      (g) => byGroup[g].length === GROUP_DEFINITIONS[g]?.length
    )
  );

  // Totals
  const totalMortgageValue = owned.reduce((sum, p) => {
    if (p.mortgaged) return sum;
    return sum + Math.floor((p.price || 0) / 2);
  }, 0);
  const houseCount = owned.reduce((sum, p) => sum + (p.houses === 5 ? 0 : p.houses || 0), 0);
  const hotelCount = owned.filter((p) => p.houses === 5).length;
  const mortgagedCount = owned.filter((p) => p.mortgaged).length;
  const monopolyCount = completedGroups.size;

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
                {isOwn ? 'Your Holdings' : `${player.name}'s Holdings`}
              </h3>
              <p className="font-display text-sm font-bold tracking-tight" style={{ color: playerColor }}>
                ${player.money.toLocaleString()}
                {!isOwn && (
                  <span className="text-xs text-white/40 font-body font-normal ml-2">
                    (view only)
                  </span>
                )}
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
                        <PropertyCard
                          key={p.id}
                          property={p}
                          groupColor={gc}
                          actionable={isOwn}
                          hasMonopoly={isMonopoly}
                          sendMessage={sendMessage}
                        />
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
                <PropertyCard
                  key={p.id}
                  property={p}
                  icon="🚂"
                  actionable={isOwn}
                  sendMessage={sendMessage}
                />
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
                <PropertyCard
                  key={p.id}
                  property={p}
                  icon="💡"
                  actionable={isOwn}
                  sendMessage={sendMessage}
                />
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

function PropertyCard({ property, groupColor, icon, actionable, hasMonopoly, sendMessage }) {
  const swatchColor = groupColor?.bg || (icon === '🚂' ? '#3a3a3a' : icon === '💡' ? '#6b7280' : '#555');
  const mortgageValue = Math.floor((property.price || 0) / 2);
  const unmortgageCost = Math.floor(mortgageValue * 1.1);
  const houseCost = property.houseCost || BOARD_SPACES[property.id]?.houseCost || 0;
  const sellHouseRefund = Math.floor(houseCost / 2);
  const isProperty = property.type === 'property';

  // Which actions are available right now for this property?
  // (Mirrors the rules enforced server-side.)
  const canBuyHouse =
    actionable && isProperty && hasMonopoly && !property.mortgaged && property.houses < 5;
  const canSellHouse = actionable && property.houses > 0;
  const canMortgage = actionable && !property.mortgaged && property.houses === 0;
  const canUnmortgage = actionable && property.mortgaged;

  const showActions = canBuyHouse || canSellHouse || canMortgage || canUnmortgage;

  return (
    <div
      className={`relative rounded-md p-2.5 border ${
        property.mortgaged
          ? 'bg-red-950/20 border-red-500/20'
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
      </div>

      {/* Action buttons — only rendered for properties YOU own */}
      {showActions && (
        <div className="flex flex-wrap gap-1 mt-2 ml-2">
          {canBuyHouse && (
            <button
              onClick={() => sendMessage?.({ type: 'buyHouse', propertyId: property.id })}
              className="text-[10px] font-mono px-2 py-1 rounded border border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20 hover:border-green-400/50 transition-colors"
              title={`Build a ${property.houses === 4 ? 'hotel' : 'house'} (replaces 4 houses with hotel)`}
            >
              + 🏠 ${houseCost}
            </button>
          )}
          {canSellHouse && (
            <button
              onClick={() => sendMessage?.({ type: 'sellHouse', propertyId: property.id })}
              className="text-[10px] font-mono px-2 py-1 rounded border border-orange-500/30 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 hover:border-orange-400/50 transition-colors"
              title="Sell back for half the build cost"
            >
              − 🏠 +${sellHouseRefund}
            </button>
          )}
          {canMortgage && (
            <button
              onClick={() => sendMessage?.({ type: 'mortgage', propertyId: property.id })}
              className="text-[10px] font-mono px-2 py-1 rounded border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-400/50 transition-colors"
              title="Lift cash by mortgaging — no rent collected while mortgaged"
            >
              Mortgage +${mortgageValue}
            </button>
          )}
          {canUnmortgage && (
            <button
              onClick={() => sendMessage?.({ type: 'unmortgage', propertyId: property.id })}
              className="text-[10px] font-mono px-2 py-1 rounded border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/50 transition-colors"
              title="Pay back the mortgage plus 10% interest"
            >
              Unmortgage −${unmortgageCost}
            </button>
          )}
        </div>
      )}

      {/* Hint when you own the property but can't build because the color set isn't complete */}
      {actionable && isProperty && !hasMonopoly && !property.mortgaged && property.houses === 0 && (
        <p className="text-[9px] text-white/25 font-mono mt-1.5 ml-2 italic">
          Complete the color set to build houses
        </p>
      )}
    </div>
  );
}