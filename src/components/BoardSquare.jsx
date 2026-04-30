import { TOKENS } from '../utils/tokens';
import { GROUP_COLORS } from '../utils/board';

export default function BoardSquare({ space, pos, property, playersHere, ownerColor }) {
  const isCorner = [0, 10, 20, 30].includes(space.id);
  const isProperty = space.type === 'property';
  const groupColor = isProperty ? GROUP_COLORS[space.group] : null;

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
      {/* Owner tint */}
      {ownerColor && (
        <div
          className="absolute inset-0"
          style={{ background: `${ownerColor}10` }}
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
            width: colorStripSide === 'left' || colorStripSide === 'right' ? '5px' : '100%',
            height: colorStripSide === 'top' || colorStripSide === 'bottom' ? '5px' : '100%',
            background: groupColor.bg,
          }}
        />
      )}

      {/* Owner indicator dot */}
      {ownerColor && (
        <div
          className="absolute z-10 w-2 h-2 rounded-full"
          style={{
            background: ownerColor,
            boxShadow: `0 0 4px ${ownerColor}60`,
            bottom: pos.side === 'bottom' || isCorner ? 2 : undefined,
            top: pos.side === 'top' ? 2 : undefined,
            left: pos.side === 'left' ? 2 : (pos.side === 'bottom' || pos.side === 'top' ? 2 : undefined),
            right: pos.side === 'right' ? 2 : undefined,
          }}
        />
      )}

      {/* Mortgage overlay */}
      {property?.mortgaged && (
        <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center">
          <span className="text-[7px] text-red-400 font-mono rotate-[-30deg]">MORTGAGED</span>
        </div>
      )}

      {/* Content */}
      <div className={`
        relative z-10 flex flex-col items-center justify-center h-full w-full p-0.5
        ${isCorner ? 'p-1' : ''}
      `}>
        {/* Icon for special spaces */}
        {space.icon && isCorner && (
          <span className="text-base mb-0.5">{space.icon}</span>
        )}
        {space.icon && !isCorner && (
          <span className="text-[10px]">{space.icon}</span>
        )}

        {/* Name */}
        <span className={`
          text-center leading-tight font-body
          ${isCorner ? 'text-[8px] font-semibold text-white/60' : 'text-[6px] text-white/40'}
        `}>
          {space.shortName}
        </span>

        {/* Price */}
        {space.price && !isCorner && (
          <span className="text-[6px] text-amber-500/40 font-mono mt-0.5">
            ${space.price}
          </span>
        )}

        {/* Houses */}
        {property && property.houses > 0 && property.houses < 5 && (
          <div className="flex gap-px mt-0.5">
            {Array.from({ length: property.houses }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-green-500 rounded-sm" />
            ))}
          </div>
        )}
        {property?.houses === 5 && (
          <div className="w-2.5 h-2.5 bg-red-500 rounded-sm mt-0.5" title="Hotel" />
        )}

        {/* Tax amount */}
        {space.type === 'tax' && (
          <span className="text-[6px] text-red-400/60 font-mono">${space.amount}</span>
        )}
      </div>

      {/* Player tokens */}
      {playersHere.length > 0 && (
        <div className="absolute z-30 bottom-0.5 right-0.5 flex flex-wrap gap-px justify-end max-w-full">
          {playersHere.map((p) => (
            <div
              key={p.index}
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] border"
              style={{
                background: `${p.color}30`,
                borderColor: `${p.color}80`,
                boxShadow: `0 0 3px ${p.color}40`,
              }}
              title={p.name}
            >
              {TOKENS[p.token]?.emoji || '?'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
