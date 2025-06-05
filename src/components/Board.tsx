import React from 'react';
import styles from './Board.module.css';
import { Guess } from '../App';
import GuessRow from './GuessRow';

interface BoardProps {
  guesses: Guess[];
  currentGuess: string;
  wordLength: number;
  maxAttempts: number;
}

const Board: React.FC<BoardProps> = ({ guesses, currentGuess, wordLength, maxAttempts }) => {
  const rows = [];
  for (let i = 0; i < maxAttempts; i++) {
    if (i < guesses.length) {
      rows.push(<GuessRow key={i} guess={guesses[i]} wordLength={wordLength} />);
    } else if (i === guesses.length) {
      rows.push(<GuessRow key={i} currentGuess={currentGuess} wordLength={wordLength} />);
    } else {
      rows.push(<GuessRow key={i} wordLength={wordLength} />);
    }
  }
  return <div className={styles.board}>{rows}</div>;
};

export default Board; 