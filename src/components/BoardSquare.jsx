import { TOKENS } from '../utils/tokens';
import { GROUP_COLORS } from '../utils/board';

export default function BoardSquare({ space, pos, property, playersHere, ownerColor, ownerToken, myIndex }) {
  const isCorner = [0, 10, 20, 30].includes(space.id);
  const isProperty = space.type === 'property';
  const groupColor = isProperty ? GROUP_COLORS[space.group] : null;
  const ownedByMe = property && property.owner === myIndex;
  const ownedByOther = property && property.owner != null && !ownedByMe;

  // Grid positioning
  const style = {
    gridColumn: pos.col + 1,
    gridRow: pos.row + 1,
  };

  // Color strip position based on which side of the board
  const colorStripSide = {
    bottom: 'top',
    top: 'bottom',
    left: 'right',
    right: 'left',
  }[pos.side];

  return (
    <div
      style={style}
      className={`
        relative overflow-hidden flex flex-col
        ${isCorner ? 'items-center justify-center' : ''}
        ${ownerColor ? '' : 'bg-[#0f2518]'}
      `}
      title={`${space.name}${space.price ? ` — $${space.price}` : ''}`}
    >
      {/* Owner tint — strong enough to actually see */}
      {ownerColor && (
        <div
          className="absolute inset-0"
          style={{ background: `${ownerColor}${ownedByMe ? '60' : '40'}` }}
        />
      )}

      {/* Base background */}
      {!ownerColor && (
        <div className="absolute inset-0 bg-[#0f2518]" />
      )}

      {/* Color strip for properties */}
      {groupColor && !isCorner && (
        <div
          className="absolute z-10"
          style={{
            [colorStripSide]: 0,
            left: colorStripSide === 'top' || colorStripSide === 'bottom' ? 0 : undefined,
            right: colorStripSide === 'top' || colorStripSide === 'bottom' ? 0 : undefined,
            top: colorStripSide === 'left' || colorStripSide === 'right' ? 0 : undefined,
            bottom: colorStripSide === 'left' || colorStripSide === 'right' ? 0 : undefined,
            width: colorStripSide === 'left' || colorStripSide === 'right' ? '6px' : '100%',
            height: colorStripSide === 'top' || colorStripSide === 'bottom' ? '6px' : '100%',
            background: groupColor.bg,
            boxShadow: `0 0 4px ${groupColor.bg}80`,
          }}
        />
      )}

      {/* OWNERSHIP FRAME — solid colored border around the whole square.
          This is the primary visual signal of "someone owns this". */}
      {ownerColor && !isCorner && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            border: ownedByMe ? `3px solid ${ownerColor}` : `2px solid ${ownerColor}`,
            boxShadow: ownedByMe
              ? `inset 0 0 12px ${ownerColor}aa, 0 0 8px ${ownerColor}66`
              : `inset 0 0 6px ${ownerColor}66`,
          }}
        />
      )}

      {/* OWNER BADGE — small colored chip in the corner showing the owner's token.
          Tells you at a glance WHO owns this, not just THAT it's owned. */}
      {ownerColor && !isCorner && ownerToken && (
        <div
          className="absolute z-30 flex items-center justify-center rounded-full font-bold"
          style={{
            background: ownerColor,
            border: '1.5px solid rgba(255,255,255,0.9)',
            boxShadow: `0 1px 4px rgba(0,0,0,0.5), 0 0 6px ${ownerColor}`,
            width: 14,
            height: 14,
            fontSize: 9,
            lineHeight: 1,
            // Place opposite to where the player tokens render (which is bottom-right).
            // We put the owner badge in the corner away from the color strip.
            ...(pos.side === 'bottom' && { top: 9, left: 2 }),
            ...(pos.side === 'top'    && { bottom: 9, left: 2 }),
            ...(pos.side === 'left'   && { top: 2, right: 9 }),
            ...(pos.side === 'right'  && { top: 2, left: 9 }),
          }}
          title={ownedByMe ? 'Owned by you' : 'Owned'}
        >
          {TOKENS[ownerToken]?.emoji || '●'}
        </div>
      )}

      {/* Mortgage overlay */}
      {property?.mortgaged && (
        <div className="absolute inset-0 bg-black/55 z-40 flex items-center justify-center">
          <span className="text-[8px] text-red-300 font-mono font-bold rotate-[-30deg] tracking-wider">MORTGAGED</span>
        </div>
      )}

      {/* Content */}
      <div className={`
        relative z-10 flex flex-col items-center justify-center h-full w-full p-0.5
        ${isCorner ? 'p-1' : ''}
      `}>
        {/* Icon for special spaces */}
        {space.icon && isCorner && (
          <span className="text-lg mb-0.5">{space.icon}</span>
        )}
        {space.icon && !isCorner && (
          <span className="text-xs">{space.icon}</span>
        )}

        {/* Name — readable now */}
        <span className={`
          text-center leading-tight font-body
          ${isCorner ? 'text-[10px] font-bold text-white/90' : 'text-[9px] font-medium text-white/80'}
        `}>
          {space.shortName}
        </span>

        {/* Price */}
        {space.price && !isCorner && (
          <span className="text-[8px] text-amber-300/70 font-mono mt-0.5 font-semibold">
            ${space.price}
          </span>
        )}

        {/* Houses */}
        {property && property.houses > 0 && property.houses < 5 && (
          <div className="flex gap-0.5 mt-0.5">
            {Array.from({ length: property.houses }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-green-400 rounded-sm shadow-sm shadow-green-500/50" />
            ))}
          </div>
        )}
        {property?.houses === 5 && (
          <div className="w-3 h-3 bg-red-500 rounded-sm mt-0.5 shadow-sm shadow-red-500/60" title="Hotel" />
        )}

        {/* Tax amount */}
        {space.type === 'tax' && (
          <span className="text-[9px] text-red-300 font-mono font-semibold">${space.amount}</span>
        )}
      </div>

      {/* Player tokens — yours is bigger and gets a pulsing halo */}
      {playersHere.length > 0 && (
        <div className="absolute z-30 bottom-0.5 right-0.5 flex flex-wrap gap-0.5 justify-end max-w-full">
          {/* Render "me" last so it draws on top */}
          {[...playersHere].sort((a, b) => (a.index === myIndex ? 1 : 0) - (b.index === myIndex ? 1 : 0)).map((p) => {
            const isMe = p.index === myIndex;
            return (
              <div
                key={p.index}
                className={`rounded-full flex items-center justify-center border-2 ${isMe ? 'token-me w-6 h-6 text-sm' : 'w-4 h-4 text-[9px]'}`}
                style={{
                  background: `${p.color}${isMe ? '60' : '35'}`,
                  borderColor: isMe ? '#fff' : `${p.color}cc`,
                  boxShadow: isMe ? undefined : `0 0 4px ${p.color}80`,
                  '--me-color': p.color,
                }}
                title={isMe ? `${p.name} (you)` : p.name}
              >
                {TOKENS[p.token]?.emoji || '?'}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}