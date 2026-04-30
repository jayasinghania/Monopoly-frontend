import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import LandingScreen from './components/LandingScreen';
import LobbyScreen from './components/LobbyScreen';

export default function App() {
  const { sendMessage, addListener, status } = useWebSocket();
  const [screen, setScreen] = useState('landing'); // landing | lobby | game
  const [gameState, setGameState] = useState(null);
  const [myIndex, setMyIndex] = useState(-1);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  // Listen for server messages
  useEffect(() => {
    const unsubs = [
      addListener('state', (msg) => {
        setGameState(msg.state);
        setMyIndex(msg.yourIndex);
        if (msg.state.state === 'lobby' && screen !== 'lobby') setScreen('lobby');
        if (msg.state.state === 'playing' && screen !== 'game') setScreen('game');
        if (msg.state.state === 'finished' && screen !== 'game') setScreen('game');
      }),
      addListener('roomCreated', (msg) => {
        setScreen('lobby');
      }),
      addListener('roomJoined', (msg) => {
        setScreen('lobby');
      }),
      addListener('error', (msg) => {
        setError(msg.message);
        setTimeout(() => setError(''), 4000);
      }),
      addListener('log', (msg) => {
        setLogs((prev) => [...prev.slice(-49), { text: msg.message, time: Date.now() }]);
      }),
    ];

    return () => unsubs.forEach((fn) => fn());
  }, [addListener, screen]);

  const handleCreateRoom = useCallback((name) => {
    sendMessage({ type: 'createRoom', name });
  }, [sendMessage]);

  const handleJoinRoom = useCallback((name, code) => {
    sendMessage({ type: 'joinRoom', name, code });
  }, [sendMessage]);

  return (
    <div className="relative min-h-screen">
      {/* Connection status */}
      {status !== 'connected' && screen !== 'landing' && (
        <div className="fixed top-0 inset-x-0 z-50 bg-red-900/90 backdrop-blur-sm border-b border-red-500/30 px-4 py-2 text-center">
          <span className="text-red-200 text-sm font-body">
            {status === 'connecting' ? '⏳ Reconnecting...' : '🔌 Disconnected — retrying...'}
          </span>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-up">
          <div className="px-5 py-3 bg-red-900/90 backdrop-blur-sm border border-red-500/30 rounded-lg shadow-lg">
            <span className="text-red-200 text-sm font-body">{error}</span>
          </div>
        </div>
      )}

      {/* Screens */}
      {screen === 'landing' && (
        <LandingScreen onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
      )}

      {screen === 'lobby' && (
        <LobbyScreen gameState={gameState} myIndex={myIndex} sendMessage={sendMessage} />
      )}

      {screen === 'game' && (
        <div className="min-h-screen bg-main bg-felt-texture flex items-center justify-center">
          <div className="card-elevated deco-corners p-12 text-center">
            <p className="font-display text-2xl text-gold text-glow mb-4">
              Game Board
            </p>
            <p className="text-amber-500/40 font-body">
              Phase 2 — Board & Core Mechanics coming next
            </p>
            <div className="mt-6 text-left card p-4 max-h-60 overflow-y-auto log-scroll">
              <p className="text-[10px] text-amber-500/30 font-mono mb-2 tracking-wider uppercase">Game Log</p>
              {logs.map((log, i) => (
                <p key={i} className="text-xs text-white/50 font-body py-0.5">{log.text}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
