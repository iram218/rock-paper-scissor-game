import { GoogleGenAI, Type } from "@google/genai";
import { Gesture } from '../types';

// --- IMPORTANT ACTION REQUIRED ---
// 1. Get your API key from Google AI Studio: https://aistudio.google.com/app/apikey
// 2. Paste your API key here between the quotes.
const API_KEY = "PASTE_YOUR_GEMINI_API_KEY_HERE";
// ---------------------------------

if (API_KEY === "PASTE_YOUR_GEMINI_API_KEY_HERE") {
    throw new Error("API_KEY has not been set. Please open services/geminiService.ts and add your key.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const gestureSchema = {
    type: Type.OBJECT,
    properties: {
        gesture: {
            type: Type.STRING,
            enum: ['Rock', 'Paper', 'Scissors', 'Unknown'],
            description: 'The identified hand gesture.'
        },
    },
    required: ['gesture'],
};


export const recognizeGesture = async (base64Image: string): Promise<Gesture> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: base64Image,
                    },
                },
                {
                    text: "Analyze the image of a hand and determine if it's showing 'Rock', 'Paper', or 'Scissors'. If the gesture is unclear or something else, classify it as 'Unknown'."
                },
            ],
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: gestureSchema,
        },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);
    
    const gesture = parsed.gesture;

    if (['Rock', 'Paper', 'Scissors', 'Unknown'].includes(gesture)) {
        return gesture as Gesture;
    }
    
    console.warn('Unexpected gesture returned by API:', gesture);
    return 'Unknown';

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to recognize gesture via Gemini API.");
  }
};