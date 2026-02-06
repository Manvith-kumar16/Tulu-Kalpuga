export interface StrokePath {
    viewBox: string;
    paths: string[]; // Array of SVG path commands (d attribute)
}

// Map letter transliteration (or char) to its stroke paths
// Users will need to populate this with real SVG data
export const tuluStrokePaths: Record<string, StrokePath> = {
    // Example placeholder for 'a' (using a generic spiral/shape for demo)
    // Placeholder removed to ensure generic simulation is used
    // "a": { ... } 
};

export const getStrokePaths = (transliteration: string): StrokePath | null => {
    return tuluStrokePaths[transliteration] || null;
};
