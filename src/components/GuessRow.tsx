import React from 'react';
import styles from './GuessRow.module.css';
import { Guess } from '../App';

interface GuessRowProps {
  guess?: Guess;
  currentGuess?: string;
  wordLength: number;
}

const GuessRow: React.FC<GuessRowProps> = ({ guess, currentGuess, wordLength }) => {
  let cells: React.ReactNode[] = [];
  if (guess) {
    cells = guess.map((g, i) => (
      <div key={i} className={`${styles.cell} ${g.state ? styles[g.state] : ''}`}>{g.letter.toUpperCase()}</div>
    ));
  } else if (currentGuess) {
    cells = Array.from({ length: wordLength }).map((_, i) => (
      <div key={i} className={styles.cell}>
        {currentGuess[i] ? currentGuess[i].toUpperCase() : ''}
      </div>
    ));
  } else {
    cells = Array.from({ length: wordLength }).map((_, i) => (
      <div key={i} className={styles.cell}></div>
    ));
  }
  return <div className={styles.row}>{cells}</div>;
};

export default GuessRow; 