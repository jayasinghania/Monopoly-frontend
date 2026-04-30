export default function CardModal({ card, onDismiss }) {
  if (!card) return null;

  const isChance = card.cardType === 'chance';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-80 rounded-xl overflow-hidden shadow-2xl animate-scale-in cursor-pointer"
        onClick={onDismiss}
      >
        {/* Header */}
        <div
          className="px-6 py-4 text-center"
          style={{
            background: isChance
              ? 'linear-gradient(135deg, #EA580C, #DC2626)'
              : 'linear-gradient(135deg, #2563EB, #7C3AED)',
          }}
        >
          <span className="text-2xl mb-1 block">{isChance ? '❓' : '📦'}</span>
          <h3 className="font-display text-sm tracking-[0.3em] uppercase text-white/90 font-semibold">
            {isChance ? 'Chance' : 'Community Chest'}
          </h3>
        </div>

        {/* Body */}
        <div className="bg-[#faf8f0] px-6 py-6 text-center">
          <p className="text-[#1a1a2e] font-display text-lg leading-relaxed font-medium">
            {card.card.text}
          </p>
        </div>

        {/* Footer */}
        <div className="bg-[#f0ece0] px-6 py-3 text-center">
          <span className="text-[#1a1a2e]/40 text-xs font-body">Tap to dismiss</span>
        </div>
      </div>
    </div>
  );
}
