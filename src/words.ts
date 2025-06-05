// This module now loads words from public/data/*.json at runtime

const DATA_FILES = [
  '/data/SAT369_definitions_examples.json',
  '/data/oxford_3000.json',
  '/data/oxford_5000_exclusive.json',
];

let cachedWords: string[] | null = null;

async function loadAllWords(): Promise<string[]> {
  if (cachedWords) return cachedWords;
  const allWords: string[] = [];
  for (const file of DATA_FILES) {
    const resp = await fetch(file);
    const data = await resp.json();
    // Each file is an object with numeric keys
    for (const key in data) {
      if (data[key] && typeof data[key].word === 'string') {
        allWords.push(data[key].word.toLowerCase());
      }
    }
  }
  cachedWords = Array.from(new Set(allWords)); // dedupe
  return cachedWords;
}

export async function getWordList(length: number): Promise<string[]> {
  const all = await loadAllWords();
  return all.filter(w => w.length === length);
}

export async function pickRandomWord(length: number): Promise<string> {
  const list = await getWordList(length);
  return list[Math.floor(Math.random() * list.length)];
} 