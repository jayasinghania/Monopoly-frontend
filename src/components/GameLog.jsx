import { useEffect, useRef } from 'react';

export default function GameLog({ logs }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  return (
    <div className="card flex-1 min-h-0 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-3 log-scroll space-y-1">
        {logs.length === 0 && (
          <p className="text-white/15 text-xs font-body italic">Game events will appear here...</p>
        )}
        {logs.map((log, i) => (
          <div
            key={i}
            className={`
              text-[11px] font-body py-0.5 leading-relaxed
              ${i === logs.length - 1 ? 'text-white/70' : 'text-white/35'}
            `}
          >
            {log.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
