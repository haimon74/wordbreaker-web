import React, { useState, useEffect } from 'react';
import { pickRandomWord, evaluateGuess, isValidWord, LetterState } from './utils';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import styles from './App.module.css';

export type GuessLetter = {
  letter: string;
  state: LetterState | null;
};
export type Guess = GuessLetter[];
export type GameState = {
  targetWord: string;
  guesses: Guess[];
  currentGuess: string;
  status: 'playing' | 'won' | 'lost';
  wordLength: number;
  maxAttempts: number;
};

const defaultWordLength = 5;
const MAX_ATTEMPTS = 7;
const STORAGE_KEY = 'wordbreaker-game-state';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingWord, setCheckingWord] = useState(false);

  // Load from storage or start new game
  useEffect(() => {
    const load = async () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (
            typeof parsed === 'object' &&
            typeof parsed.targetWord === 'string' &&
            Array.isArray(parsed.guesses) &&
            typeof parsed.currentGuess === 'string' &&
            typeof parsed.status === 'string' &&
            typeof parsed.wordLength === 'number' &&
            typeof parsed.maxAttempts === 'number'
          ) {
            setGameState(parsed);
            setLoading(false);
            return;
          }
        } catch {}
      }
      const word = await pickRandomWord(defaultWordLength);
      setGameState({
        targetWord: word,
        guesses: [],
        currentGuess: '',
        status: 'playing',
        wordLength: defaultWordLength,
        maxAttempts: MAX_ATTEMPTS,
      });
      setLoading(false);
    };
    load();
  }, []);

  // Persist game state
  useEffect(() => {
    if (gameState) localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const handleWordLengthChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const length = parseInt(e.target.value, 10);
    localStorage.removeItem(STORAGE_KEY);
    setLoading(true);
    const word = await pickRandomWord(length);
    setGameState({
      targetWord: word,
      guesses: [],
      currentGuess: '',
      status: 'playing',
      wordLength: length,
      maxAttempts: MAX_ATTEMPTS,
    });
    setLoading(false);
  };

  const handleNewGame = async () => {
    localStorage.removeItem(STORAGE_KEY);
    setLoading(true);
    const word = await pickRandomWord(gameState!.wordLength);
    setGameState({
      targetWord: word,
      guesses: [],
      currentGuess: '',
      status: 'playing',
      wordLength: gameState!.wordLength,
      maxAttempts: MAX_ATTEMPTS,
    });
    setLoading(false);
  };

  const handleKey = async (key: string) => {
    if (!gameState || gameState.status !== 'playing') return;
    if (/^[a-zA-Z]$/.test(key) && gameState.currentGuess.length < gameState.wordLength) {
      setGameState(gs => gs && { ...gs, currentGuess: gs.currentGuess + key.toLowerCase() });
    } else if (key === 'Backspace') {
      setGameState(gs => gs && { ...gs, currentGuess: gs.currentGuess.slice(0, -1) });
    } else if (key === 'Enter') {
      if (gameState.currentGuess.length !== gameState.wordLength) return;
      setCheckingWord(true);
      const valid = await isValidWord(gameState.currentGuess, gameState.wordLength);
      setCheckingWord(false);
      if (!valid) {
        alert('Not a valid word!');
        return;
      }
      const states = evaluateGuess(gameState.currentGuess, gameState.targetWord);
      const guess: Guess = gameState.currentGuess.split('').map((letter, i) => ({
        letter,
        state: states[i],
      }));
      const guesses = [...gameState.guesses, guess];
      let status: GameState['status'] = 'playing';
      if (gameState.currentGuess === gameState.targetWord) status = 'won';
      else if (guesses.length >= gameState.maxAttempts) status = 'lost';
      setGameState(gs => gs && {
        ...gs,
        guesses,
        currentGuess: '',
        status,
      });
    }
  };

  // Keyboard event listener (for physical keyboard)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (gameState && gameState.status === 'playing') handleKey(e.key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line
  }, [gameState]);

  if (loading || !gameState) return <div className={styles.App}><h1 className={styles.title}>Word Breaker</h1><div>Loading...</div></div>;

  return (
    <div className={styles.App}>
      <div className={styles.gameContainer}>
        <h1 className={styles.title}>Word Breaker</h1>
        <div className={styles.controls}>
          <label className={styles.label}>
            Word Length:
            <select className={styles.select} value={gameState.wordLength} onChange={handleWordLengthChange} disabled={loading || checkingWord}>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
            </select>
          </label>
          {(gameState.status === 'won' || gameState.status === 'lost') && (
            <button className={styles.button} onClick={handleNewGame} disabled={loading}>New Game</button>
          )}
        </div>
        <Board
          guesses={gameState.guesses}
          currentGuess={gameState.currentGuess}
          wordLength={gameState.wordLength}
          maxAttempts={gameState.maxAttempts}
        />
        <Keyboard onKey={handleKey} guesses={gameState.guesses} />
        <div className={styles.status}>
          {gameState.status === 'won' && <div>🎉 You won! The word was <b>{gameState.targetWord}</b>.</div>}
          {gameState.status === 'lost' && <div>😢 You lost! The word was <b>{gameState.targetWord}</b>.</div>}
          {checkingWord && <div>Checking word...</div>}
        </div>
      </div>
    </div>
  );
};

export default App;
