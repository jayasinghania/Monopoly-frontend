import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import LandingScreen from './components/LandingScreen';
import LobbyScreen from './components/LobbyScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import Countdown from './components/Countdown';
import { loadSession, saveSession, clearSession } from './utils/session';

export default function App() {
  const { sendMessage, addListener, status } = useWebSocket();

  // If we have a saved session, start in 'restoring' instead of 'landing' so
  // the user doesn't see the landing page flicker while we rejoin.
  const initialSession = useRef(loadSession()).current;
  const [screen, setScreen] = useState(initialSession ? 'restoring' : 'landing');
  // restoring | landing | lobby | game | finished

  const [gameState, setGameState] = useState(null);
  const [myIndex, setMyIndex] = useState(-1);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const [finalScores, setFinalScores] = useState(null);

  // Identity — used both for socket-reconnect and for tab-reload restore.
  const [myName, setMyName] = useState(initialSession?.name || '');
  const [roomCode, setRoomCode] = useState(initialSession?.code || '');

  // Tracks whether we're currently trying to restore a saved session,
  // so we can interpret error responses (e.g. "Room not found") correctly.
  const restoringRef = useRef(Boolean(initialSession));

  // Countdown shown when transitioning from lobby -> game (only on first start,
  // not on reload/rejoin into an in-progress game).
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    const unsubs = [
      addListener('state', (msg) => {
        setGameState(msg.state);
        setMyIndex(msg.yourIndex);
        if (msg.state.state === 'lobby' && screen !== 'lobby') setScreen('lobby');
        if (msg.state.state === 'playing' && screen !== 'game') {
          // Only show the 3-2-1 countdown if we're transitioning out of the
          // lobby (game just started). On a reload/rejoin into a game already
          // in progress, `screen` will be 'restoring' or 'landing', so we skip.
          if (screen === 'lobby') {
            setShowCountdown(true);
          }
          setScreen('game');
        }
        if (msg.state.state === 'finished' && screen !== 'finished') setScreen('finished');
      }),
      addListener('gameOver', (msg) => {
        setFinalScores(msg.scores);
        setScreen('finished');
        // Game's done — don't auto-rejoin a finished game on next reload.
        clearSession();
      }),
      addListener('roomCreated', (msg) => {
        if (msg.code) {
          setRoomCode(msg.code);
          if (myName) saveSession(myName, msg.code);
        }
        restoringRef.current = false;
        setScreen('lobby');
      }),
      addListener('roomJoined', (msg) => {
        if (msg.code) {
          setRoomCode(msg.code);
          if (myName) saveSession(myName, msg.code);
        }
        restoringRef.current = false;
        // If we don't have game state yet, leave screen alone — the next
        // 'state' message will route us to lobby/game appropriately.
      }),
      addListener('error', (msg) => {
        // If we're mid-restore and the server rejects us, the saved session
        // is stale (room was cleaned up, name taken by someone else, etc.).
        // Drop the user back to landing instead of looping forever.
        if (restoringRef.current) {
          restoringRef.current = false;
          clearSession();
          setMyName('');
          setRoomCode('');
          setScreen('landing');
          setError(`Couldn't rejoin your game: ${msg.message}`);
          setTimeout(() => setError(''), 5000);
          return;
        }
        setError(msg.message);
        setTimeout(() => setError(''), 4000);
      }),
      addListener('log', (msg) => {
        setLogs((prev) => [...prev.slice(-99), { text: msg.message, time: Date.now() }]);
      }),
    ];
    return () => unsubs.forEach((fn) => fn());
  }, [addListener, screen, myName]);

  // Whenever the socket is connected and we have an identity, (re)send joinRoom.
  // Covers two cases:
  //   1. Tab just loaded with a saved session in localStorage
  //   2. Socket dropped mid-game and just reconnected
  // The backend treats this as a rejoin if the player is already in the room.
  useEffect(() => {
    if (status === 'connected' && myName && roomCode && screen !== 'landing') {
      sendMessage({ type: 'joinRoom', name: myName, code: roomCode });
    }
  }, [status, myName, roomCode, screen, sendMessage]);

  // If the socket can't connect at all for a long time during restore,
  // give up and show landing rather than spinning forever.
  useEffect(() => {
    if (!restoringRef.current) return;
    const timeout = setTimeout(() => {
      if (restoringRef.current) {
        restoringRef.current = false;
        setScreen('landing');
        setError("Couldn't reconnect — please try again.");
        setTimeout(() => setError(''), 5000);
      }
    }, 15000);
    return () => clearTimeout(timeout);
  }, []);

  const handleCreateRoom = useCallback((name) => {
    setMyName(name);
    sendMessage({ type: 'createRoom', name });
  }, [sendMessage]);

  const handleJoinRoom = useCallback((name, code) => {
    const cleanCode = (code || '').toUpperCase().trim();
    setMyName(name);
    setRoomCode(cleanCode);
    sendMessage({ type: 'joinRoom', name, code: cleanCode });
  }, [sendMessage]);

  const handleLeaveGame = useCallback(() => {
    clearSession();
    setMyName('');
    setRoomCode('');
    setGameState(null);
    setMyIndex(-1);
    setFinalScores(null);
    setLogs([]);
    setShowCountdown(false);
    setScreen('landing');
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Connection bar — shown when socket is dropped mid-game */}
      {status !== 'connected' && screen !== 'landing' && screen !== 'restoring' && (
        <div className="fixed top-0 inset-x-0 z-50 bg-red-900/90 backdrop-blur-sm border-b border-red-500/30 px-4 py-2 text-center">
          <span className="text-red-200 text-sm font-body">
            {status === 'connecting' ? '⏳ Reconnecting...' : '🔌 Disconnected — retrying...'}
          </span>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-up">
          <div className="px-5 py-3 bg-red-900/90 backdrop-blur-sm border border-red-500/30 rounded-lg shadow-lg max-w-sm">
            <span className="text-red-200 text-sm font-body">{error}</span>
          </div>
        </div>
      )}

      {/* Restoring screen — shown on page reload while we rejoin */}
      {screen === 'restoring' && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="animate-pulse text-5xl mb-6">🎩</div>
          <h2 className="text-2xl font-display mb-2">Rejoining your game…</h2>
          <p className="text-slate-400 font-body text-sm mb-6">
            Reconnecting as <span className="text-white">{myName}</span> in room{' '}
            <span className="text-white">{roomCode}</span>
          </p>
          <button
            onClick={handleLeaveGame}
            className="text-xs text-slate-400 hover:text-white underline font-body"
          >
            Cancel and start fresh
          </button>
        </div>
      )}

      {screen === 'landing' && (
        <LandingScreen onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
      )}

      {screen === 'lobby' && (
        <LobbyScreen
          gameState={gameState}
          myIndex={myIndex}
          sendMessage={sendMessage}
          onLeave={handleLeaveGame}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          gameState={gameState}
          myIndex={myIndex}
          sendMessage={sendMessage}
          logs={logs}
          onLeave={handleLeaveGame}
        />
      )}

      {/* Countdown sits on top of the board for ~3s when the game starts.
          Board is already mounted underneath so it's visible the moment "GO" fades. */}
      {showCountdown && (
        <Countdown onComplete={() => setShowCountdown(false)} />
      )}

      {screen === 'finished' && (
        <GameOverScreen
          gameState={gameState}
          myIndex={myIndex}
          scores={finalScores}
          onLeave={handleLeaveGame}
        />
      )}
    </div>
  );
}