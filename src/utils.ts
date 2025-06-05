import { getWordList, pickRandomWord } from './words';

export type LetterState = 'correct' | 'present' | 'absent';

export function evaluateGuess(guess: string, target: string): LetterState[] {
  const result: LetterState[] = Array(guess.length).fill('absent');
  const targetArr = target.split('');
  const guessArr = guess.split('');

  // First pass: greens
  for (let i = 0; i < guess.length; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = 'correct';
      targetArr[i] = '_'; // Mark as used
      guessArr[i] = '-';  // Mark as matched
    }
  }
  // Second pass: yellows
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'correct') continue;
    const index = targetArr.indexOf(guessArr[i]);
    if (index !== -1 && guessArr[i] !== '-') {
      result[i] = 'present';
      targetArr[index] = '_';
    }
  }
  return result;
}

export async function isValidWord(word: string, length: number): Promise<boolean> {
  const list = await getWordList(length);
  if (list.includes(word.toLowerCase())) return true;
  // Fallback: check external dictionary API
  try {
    const resp = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!resp.ok) return false;
    const data = await resp.json();
    return Array.isArray(data) && data.length > 0 && data[0].word && typeof data[0].word === 'string';
  } catch {
    return false;
  }
}

export { getWordList, pickRandomWord }; 