import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import LandingScreen from './components/LandingScreen';
import LobbyScreen from './components/LobbyScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';

export default function App() {
  const { sendMessage, addListener, status } = useWebSocket();
  const [screen, setScreen] = useState('landing'); // landing | lobby | game | finished
  const [gameState, setGameState] = useState(null);
  const [myIndex, setMyIndex] = useState(-1);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const [finalScores, setFinalScores] = useState(null);

  useEffect(() => {
    const unsubs = [
      addListener('state', (msg) => {
        setGameState(msg.state);
        setMyIndex(msg.yourIndex);
        if (msg.state.state === 'lobby' && screen === 'landing') setScreen('lobby');
        if (msg.state.state === 'playing' && screen !== 'game') setScreen('game');
        if (msg.state.state === 'finished' && screen !== 'finished') setScreen('finished');
      }),
      addListener('gameOver', (msg) => {
        setFinalScores(msg.scores);
        setScreen('finished');
      }),
      addListener('roomCreated', () => setScreen('lobby')),
      addListener('roomJoined', () => setScreen('lobby')),
      addListener('error', (msg) => {
        setError(msg.message);
        setTimeout(() => setError(''), 4000);
      }),
      addListener('log', (msg) => {
        setLogs((prev) => [...prev.slice(-99), { text: msg.message, time: Date.now() }]);
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
      {/* Connection bar */}
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

      {screen === 'landing' && (
        <LandingScreen onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
      )}

      {screen === 'lobby' && (
        <LobbyScreen gameState={gameState} myIndex={myIndex} sendMessage={sendMessage} />
      )}

      {screen === 'game' && (
        <GameScreen
          gameState={gameState}
          myIndex={myIndex}
          sendMessage={sendMessage}
          logs={logs}
        />
      )}

      {screen === 'finished' && (
        <GameOverScreen
          gameState={gameState}
          myIndex={myIndex}
          scores={finalScores}
        />
      )}
    </div>
  );
}
