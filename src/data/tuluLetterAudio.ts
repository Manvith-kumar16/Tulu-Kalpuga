export interface LetterAudio {
  letter: string;
  transliteration: string;
  audioFile: string;
}

export const vowelAudio: LetterAudio[] = [
  { letter: "ಅ", transliteration: "a", audioFile: "/audio/vowels/a.mp3" },
  { letter: "ಆ", transliteration: "ā", audioFile: "/audio/vowels/aa.mp3" },
  { letter: "ಇ", transliteration: "i", audioFile: "/audio/vowels/i.mp3" },
  { letter: "ಈ", transliteration: "ī", audioFile: "/audio/vowels/ii.mp3" },
  { letter: "ಉ", transliteration: "u", audioFile: "/audio/vowels/u.mp3" },
  { letter: "ಊ", transliteration: "ū", audioFile: "/audio/vowels/uu.mp3" },
  { letter: "ಎ", transliteration: "e", audioFile: "/audio/vowels/e.mp3" },
  { letter: "ಏ", transliteration: "ē", audioFile: "/audio/vowels/ee.mp3" },
  { letter: "ಒ", transliteration: "o", audioFile: "/audio/vowels/o.mp3" },
  { letter: "ಓ", transliteration: "ō", audioFile: "/audio/vowels/oo.mp3" },
];

export const consonantAudio: LetterAudio[] = [
  { letter: "ಕ", transliteration: "ka", audioFile: "/audio/consonants/ka.mp3" },
  { letter: "ಖ", transliteration: "kha", audioFile: "/audio/consonants/kha.mp3" },
  { letter: "ಗ", transliteration: "ga", audioFile: "/audio/consonants/ga.mp3" },
  { letter: "ಘ", transliteration: "gha", audioFile: "/audio/consonants/gha.mp3" },
  { letter: "ಚ", transliteration: "cha", audioFile: "/audio/consonants/cha.mp3" },
  { letter: "ಛ", transliteration: "chha", audioFile: "/audio/consonants/chha.mp3" },
  { letter: "ಜ", transliteration: "ja", audioFile: "/audio/consonants/ja.mp3" },
  { letter: "ಝ", transliteration: "jha", audioFile: "/audio/consonants/jha.mp3" },
  { letter: "ಟ", transliteration: "ṭa", audioFile: "/audio/consonants/ta.mp3" },
  { letter: "ಠ", transliteration: "ṭha", audioFile: "/audio/consonants/tha.mp3" },
  { letter: "ಡ", transliteration: "ḍa", audioFile: "/audio/consonants/da.mp3" },
  { letter: "ಢ", transliteration: "ḍha", audioFile: "/audio/consonants/dha.mp3" },
  { letter: "ಣ", transliteration: "ṇa", audioFile: "/audio/consonants/na.mp3" },
  { letter: "ತ", transliteration: "ta", audioFile: "/audio/consonants/ta2.mp3" },
  { letter: "ಥ", transliteration: "tha", audioFile: "/audio/consonants/tha2.mp3" },
  { letter: "ದ", transliteration: "da", audioFile: "/audio/consonants/da2.mp3" },
  { letter: "ಧ", transliteration: "dha", audioFile: "/audio/consonants/dha2.mp3" },
  { letter: "ನ", transliteration: "na", audioFile: "/audio/consonants/na2.mp3" },
  { letter: "ಪ", transliteration: "pa", audioFile: "/audio/consonants/pa.mp3" },
  { letter: "ಫ", transliteration: "pha", audioFile: "/audio/consonants/pha.mp3" },
  { letter: "ಬ", transliteration: "ba", audioFile: "/audio/consonants/ba.mp3" },
  { letter: "ಭ", transliteration: "bha", audioFile: "/audio/consonants/bha.mp3" },
  { letter: "ಮ", transliteration: "ma", audioFile: "/audio/consonants/ma.mp3" },
  { letter: "ಯ", transliteration: "ya", audioFile: "/audio/consonants/ya.mp3" },
  { letter: "ರ", transliteration: "ra", audioFile: "/audio/consonants/ra.mp3" },
  { letter: "ಲ", transliteration: "la", audioFile: "/audio/consonants/la.mp3" },
  { letter: "ವ", transliteration: "va", audioFile: "/audio/consonants/va.mp3" },
  { letter: "ಶ", transliteration: "sha", audioFile: "/audio/consonants/sha.mp3" },
  { letter: "ಷ", transliteration: "ṣha", audioFile: "/audio/consonants/sha2.mp3" },
  { letter: "ಸ", transliteration: "sa", audioFile: "/audio/consonants/sa.mp3" },
  { letter: "ಹ", transliteration: "ha", audioFile: "/audio/consonants/ha.mp3" },
  { letter: "ಳ", transliteration: "ḷa", audioFile: "/audio/consonants/la2.mp3" },
  { letter: "ೞ", transliteration: "ḻa", audioFile: "/audio/consonants/zha.mp3" },
  { letter: "ಱ", transliteration: "ṟa", audioFile: "/audio/consonants/ra2.mp3" },
];

export const numberAudio: LetterAudio[] = [
  { letter: "೦", transliteration: "0", audioFile: "/audio/numbers/0.mp3" },
  { letter: "೧", transliteration: "1", audioFile: "/audio/numbers/1.mp3" },
  { letter: "೨", transliteration: "2", audioFile: "/audio/numbers/2.mp3" },
  { letter: "೩", transliteration: "3", audioFile: "/audio/numbers/3.mp3" },
  { letter: "೪", transliteration: "4", audioFile: "/audio/numbers/4.mp3" },
  { letter: "೫", transliteration: "5", audioFile: "/audio/numbers/5.mp3" },
  { letter: "೬", transliteration: "6", audioFile: "/audio/numbers/6.mp3" },
  { letter: "೭", transliteration: "7", audioFile: "/audio/numbers/7.mp3" },
  { letter: "೮", transliteration: "8", audioFile: "/audio/numbers/8.mp3" },
  { letter: "೯", transliteration: "9", audioFile: "/audio/numbers/9.mp3" },
  { letter: "೧೦", transliteration: "10", audioFile: "/audio/numbers/10.mp3" },
  { letter: "೧೦೦", transliteration: "100", audioFile: "/audio/numbers/100.mp3" },
];

export const getAudioForLetter = (letter: string): string | null => {
  const vowelMatch = vowelAudio.find(v => v.letter === letter);
  if (vowelMatch) return vowelMatch.audioFile;

  const consonantMatch = consonantAudio.find(c => c.letter === letter);
  if (consonantMatch) return consonantMatch.audioFile;

  const numberMatch = numberAudio.find(n => n.letter === letter);
  if (numberMatch) return numberMatch.audioFile;

  return null;
};