import { evaluateGuess } from './utils';

describe('evaluateGuess', () => {
  it('returns all correct for exact match', () => {
    expect(evaluateGuess('apple', 'apple')).toEqual([
      'correct', 'correct', 'correct', 'correct', 'correct',
    ]);
  });

  it('returns all absent for no matches', () => {
    expect(evaluateGuess('zzzzz', 'apple')).toEqual([
      'absent', 'absent', 'absent', 'absent', 'absent',
    ]);
  });

  it('returns present for correct letters in wrong positions', () => {
    expect(evaluateGuess('pleap', 'apple')).toEqual([
      'present', 'present', 'present', 'present', 'present',
    ]);
  });

  it('handles mixed correct, present, and absent', () => {
    expect(evaluateGuess('aplex', 'apple')).toEqual([
      'correct', 'correct', 'present', 'present', 'absent',
    ]);
  });

  it('handles repeated letters correctly', () => {
    expect(evaluateGuess('allee', 'apple')).toEqual([
      'correct', 'present', 'absent', 'absent', 'correct',
    ]);
  });
}); 