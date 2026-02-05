export interface StrokePath {
    viewBox: string;
    paths: string[]; // Array of SVG path commands (d attribute)
}

// Map letter transliteration (or char) to its stroke paths
// Users will need to populate this with real SVG data
export const tuluStrokePaths: Record<string, StrokePath> = {
    // Example placeholder for 'a' (using a generic spiral/shape for demo)
    "a": {
        viewBox: "0 0 100 100",
        paths: [
            "M30,30 Q50,10 70,30", // Stroke 1
            "M70,30 Q90,50 70,70", // Stroke 2
            "M70,70 Q50,90 30,70", // Stroke 3
            "M30,70 Q10,50 30,30", // Stroke 4 (Loop)
        ]
    },
    // Add more letters here...
};

export const getStrokePaths = (transliteration: string): StrokePath | null => {
    return tuluStrokePaths[transliteration] || null;
};
