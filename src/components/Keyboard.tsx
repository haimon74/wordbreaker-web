import React from 'react';
import styles from './Keyboard.module.css';
import { Guess } from '../App';

const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
];

interface KeyboardProps {
  onKey: (key: string) => void;
  guesses: Guess[];
}

type LetterState = 'correct' | 'present' | 'absent' | undefined;

function getKeyStates(guesses: Guess[]): Record<string, LetterState> {
  const state: Record<string, LetterState> = {};
  guesses.forEach(guess => {
    guess.forEach(({ letter, state: s }) => {
      const upper = letter.toUpperCase();
      if (!state[upper] || (s === 'correct') || (s === 'present' && state[upper] !== 'correct')) {
        state[upper] = s || undefined;
      }
    });
  });
  return state;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKey, guesses }) => {
  const keyStates = getKeyStates(guesses);
  return (
    <div className={styles.keyboard}>
      {KEYS.map((row, i) => (
        <div key={i} className={styles.row}>
          {row.map(key => {
            const keyClass = keyStates[key] ? styles[keyStates[key] as keyof typeof styles] : '';
            return (
              <button
                key={key}
                className={`${styles.key} ${keyClass}`}
                onClick={() => onKey(key)}
                tabIndex={-1}
                aria-label={key === 'Backspace' ? 'Backspace' : key === 'Enter' ? 'Enter' : key}
              >
                {key === 'Backspace' ? '⌫' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard; 