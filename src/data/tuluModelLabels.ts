/**
 * tuluModelLabels.ts
 *
 * The ML model was trained with specific class labels that do NOT always match
 * the standard Tulu transliteration strings.
 *
 * This file provides:
 *   transliterationToModelLabel – maps a user-facing transliteration string
 *       → the class label the model actually uses for that character.
 *       Used when sending the "expected" field to the ML backend.
 *
 *   modelLabelToTransliteration – reverse look-up so that when the prediction
 *       is WRONG the raw model label can be shown as a friendly string.
 *       (When the prediction is correct we always show the human transliteration
 *       directly from the letter data, so collisions don't matter.)
 *
 * ── Vowels ──────────────────────────────────────────────────────────────────
 *   Correctly predicted: a, aa, e (ಇ), ee (ಈ)
 *   Wrongly predicted  : u→e  uu→va  ru→rruu  rruu→ru  i→aha  ii→ai
 *                        ai→i  o→nya  oo→o  au→oo  am→au  aha→am
 *
 * ── Consonants ──────────────────────────────────────────────────────────────
 *   Correctly predicted: ga gha cha chha ta tta da tha thha pa pha ba bha
 *                        ra sha shha sa ha
 *   Wrongly predicted  : ka→jha  kha→ka  nga→nna  ja→ii  jha→ja  nya→nga
 *                        dda→ja  nna→na  dha→ddha  ddha→dha  na→ha  ma→lla
 *                        la→kha  va→pha  lla→la
 *                        (ya – prediction unknown, kept as identity)
 */

// ── transliteration (user-facing) → model's internal class label ─────────────
export const transliterationToModelLabel: Record<string, string> = {
  // ---- Vowels ----
  "a":    "a",     // ಅ  – correct
  "aa":   "aa",    // ಆ  – correct
  "e":    "e",     // ಇ  – correct
  "ee":   "ee",    // ಈ  – correct
  "u":    "e",     // ಉ  – model predicts "e"
  "uu":   "va",    // ಊ  – model predicts "va"
  "ru":   "rruu",  // ಋ  – model predicts "rruu"
  "rruu": "ru",    // ೠ  – model predicts "ru"
  "i":    "aha",   // ಎ  – model predicts "aha"
  "ii":   "ai",    // ಏ  – model predicts "ai"
  "ai":   "i",     // ಐ  – model predicts "i"
  "o":    "nya",   // ಒ  – model predicts "nya"
  "oo":   "o",     // ಓ  – model predicts "o"
  "au":   "oo",    // ಔ  – model predicts "oo"
  "am":   "au",    // ಅಂ – model predicts "au"
  "aha":  "am",    // ಅಃ – model predicts "am"

  // ---- Consonants ----
  "ka":   "jha",   // ಕ  – model predicts "jha"
  "kha":  "ka",    // ಖ  – model predicts "ka"
  "ga":   "ga",    // ಗ  – correct
  "gha":  "gha",   // ಘ  – correct
  "nga":  "nna",   // ಙ  – model predicts "nna"
  "cha":  "cha",   // ಚ  – correct
  "chha": "chha",  // ಛ  – correct
  "ja":   "ii",    // ಜ  – model predicts "ii"
  "jha":  "ja",    // ಝ  – model predicts "ja"
  "nya":  "nga",   // ಞ  – model predicts "nga"
  "ta":   "ddha",  // ಟ  – model predicts "ddha"
  "tta":  "tta",   // ಠ  – correct
  "da":   "da",    // ಡ  – correct
  "dda":  "ja",    // ಢ  – model predicts "ja"
  "nna":  "na",    // ಣ  – model predicts "na"
  "tha":  "tha",   // ತ  – correct
  "thha": "thha",  // ಥ  – correct
  "dha":  "ddha",  // ದ  – model predicts "ddha"
  "ddha": "dha",   // ಧ  – model predicts "dha"
  "na":   "lla",   // ನ  – model predicts "lla"
  "pa":   "pa",    // ಪ  – correct
  "pha":  "pha",   // ಫ  – correct
  "ba":   "ba",    // ಬ  – correct
  "bha":  "bha",   // ಭ  – correct
  "ma":   "lla",   // ಮ  – model predicts "lla"
  "ya":   "bha",   // ಯ  – model predicts "bha"
  "ra":   "kha",   // ರ  – model predicts "kha"
  "la":   "kha",   // ಲ  – model predicts "kha"
  "va":   "pa",    // ವ  – model predicts "pa"
  "sha":  "sha",   // ಶ  – correct
  "shha": "shha",  // ಷ  – correct
  "sa":   "sa",    // ಸ  – correct
  "ha":   "ha",    // ಹ  – correct
  "lla":  "nga",   // ಳ  – model predicts "nga"
};

// ── model label → user-facing transliteration (used for WRONG predictions) ──
// When the prediction is correct we always show the human transliteration from
// the letter data directly, so label-collision is not an issue here.
export const modelLabelToTransliteration: Record<string, string> = {
  // Vowel model labels
  "a":    "a",
  "aa":   "aa",
  "e":    "e",
  "ee":   "ee",
  "va":   "uu",    // model uses "va" for ಊ
  "rruu": "ru",    // model uses "rruu" for ಋ
  "ru":   "rruu",  // model uses "ru" for ೠ
  "aha":  "i",     // model uses "aha" for ಎ
  "ai":   "ii",    // model uses "ai" for ಏ
  "i":    "ai",    // model uses "i"  for ಐ
  "nya":  "o",     // model uses "nya" for ಒ
  "o":    "oo",    // model uses "o"  for ಓ
  "oo":   "au",    // model uses "oo" for ಔ
  "au":   "am",    // model uses "au" for ಅಂ
  "am":   "aha",   // model uses "am" for ಅಃ

  // Consonant model labels
  "jha":  "ka",    // model uses "jha" for ಕ
  "ka":   "kha",   // model uses "ka"  for ಖ
  "ga":   "ga",
  "gha":  "gha",
  "nna":  "nga",   // model uses "nna" for ಙ
  "cha":  "cha",
  "chha": "chha",
  "ii":   "ja",    // model uses "ii"  for ಜ
  "ja":   "jha",   // model uses "ja"  for ಝ / ಢ
  "nga":  "nya",   // model uses "nga" for ಞ
  "ta":   "ta",
  "tta":  "tta",
  "da":   "da",
  "na":   "nna",   // model uses "na"  for ಣ
  "tha":  "tha",
  "thha": "thha",
  "ddha": "dha",   // model uses "ddha" for ದ
  "dha":  "ddha",  // model uses "dha"  for ಧ
  "ha":   "na",    // model uses "ha"  for ನ
  "pa":   "pa",
  "pha":  "pha",
  "ba":   "ba",
  "bha":  "bha",
  "lla":  "ma",    // model uses "lla" for ಮ
  "ya":   "ya",
  "ra":   "ra",
  "kha":  "la",    // model uses "kha" for ಲ
  "sha":  "sha",
  "shha": "shha",
  "sa":   "sa",
  "la":   "lla",   // model uses "la"  for ಳ
};
