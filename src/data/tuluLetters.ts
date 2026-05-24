export const letterToTransliteration: Record<string, string> = {
  // Vowels
  "ಅ": "a",
  "ಆ": "aa",
  "ಇ": "e",   // Model predicts 'e' for this letter
  "ಈ": "ee",  // Model predicts 'ee' for this letter
  "ಉ": "u",
  "ಊ": "uu",
  "ಋ": "ru",
  "ೠ": "rruu",
  "ಎ": "i",   // Model predicts 'i' for this letter (inferred from swap)
  "ಏ": "ii",  // Model predicts 'ii' for this letter (inferred from swap)
  "ಐ": "ai",
  "ಒ": "o",
  "ಓ": "oo",
  "ಔ": "au",
  "ಅಂ": "am",
  "ಅಃ": "aha",

  // Consonants
  "ಕ": "ka",
  "ಖ": "kha",
  "ಗ": "ga",
  "ಘ": "gha",
  "ಙ": "nga", // Model: nga (Fixed from nza)
  "ಚ": "cha",
  "ಛ": "chha",
  "ಜ": "ja",
  "ಝ": "jha",
  "ಞ": "nya",
  "ಟ": "ta",
  "ಠ": "tta",
  "ಡ": "da",
  "ಢ": "dda",
  "ಣ": "nna",
  "ತ": "tha",
  "ಥ": "thha",
  "ದ": "dha",
  "ಧ": "ddha", // Model: ddha (Fixed from dhha)
  "ನ": "na",
  "ಪ": "pa",
  "ಫ": "pha",
  "ಬ": "ba",
  "ಭ": "bha",
  "ಮ": "ma",
  "ಯ": "ya",
  "ರ": "ra",
  "ಲ": "la",
  "ವ": "va",
  "ಶ": "sha",
  "ಷ": "shha",
  "ಸ": "sa",
  "ಹ": "ha",
  "ಳ": "lla",
  "ೞ": "lla", // Approximate (Model missing 'zha')
  "ಱ": "ra",  // Approximate (Model missing 'rra')

  // Numbers (Model may not support these yet, keeping straightforward mapping)
  "೦": "0",
  "೧": "1",
  "೨": "2",
  "೩": "3",
  "೪": "4",
  "೫": "5",
  "೬": "6",
  "೭": "7",
  "೮": "8",
  "೯": "9",
  "೧೦": "10",
  "೧೦೦": "100"
};
