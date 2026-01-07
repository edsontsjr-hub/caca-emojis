import { GoogleGenAI, Type } from "@google/genai";
import { LevelData } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateGameLevels = async (currentCount: number): Promise<LevelData[]> => {
  if (!apiKey) {
    console.warn("API Key missing, using fallback levels via null return");
    return [];
  }

  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      Create 5 challenging levels for a "Find the Odd Emoji Out" game for a very smart 6-year-old girl named Maria.
      
      She is very good at patterns, so make it HARDER than usual.
      
      For each level:
      1. Pick a 'baseEmoji'.
      2. Pick a 'targetEmoji' that is VERY SIMILAR to the base (e.g., slightly different clock time, moon phase, cat vs tiger, similar flowers, similar cars).
      3. Set difficulty (easy/medium/hard). 
         - Easy: Grid size 5 or 6.
         - Medium: Grid size 7 or 8.
         - Hard: Grid size 9.
      4. Avoid repeating emojis from previous levels if possible.
      
      The emojis must be standard unicode characters.
      
      Current level count offset: ${currentCount}.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              baseEmoji: { type: Type.STRING },
              targetEmoji: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] },
              gridSize: { type: Type.INTEGER },
            },
            required: ["baseEmoji", "targetEmoji", "difficulty", "gridSize"],
          },
        },
      },
    });

    const data = JSON.parse(response.text || "[]");
    
    // Map to LevelData interface with IDs
    return data.map((item: any, index: number) => ({
      id: currentCount + index + 1,
      baseEmoji: item.baseEmoji,
      targetEmoji: item.targetEmoji,
      difficulty: item.difficulty,
      gridSize: item.gridSize,
    }));

  } catch (error) {
    console.error("Failed to generate levels with Gemini:", error);
    return [];
  }
};