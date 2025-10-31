
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Sentiment } from '../types';

let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

const getAI = () => {
  if (!ai) {
    throw new Error("API_KEY environment variable not set.");
  }
  return ai;
}

const generateContent = async (prompt: string): Promise<string> => {
    const aiInstance = getAI();
    try {
        const response: GenerateContentResponse = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get response from AI. Please check your API key and network connection.");
    }
};

export const correctText = async (text: string): Promise<string> => {
  const prompt = `Please correct any spelling and grammar mistakes in the following Nepali text. Only return the corrected text, without any additional explanation.\n\nText: "${text}"`;
  return generateContent(prompt);
};

export const detectSentiment = async (text: string): Promise<Sentiment> => {
  const prompt = `Analyze the sentiment of the following text and classify it as HAPPY, ANGRY, or NEUTRAL. Return only one of these three words.\n\nText: "${text}"`;
  const result = await generateContent(prompt);
  const sentiment = result.trim().toUpperCase();
  if (sentiment === 'HAPPY' || sentiment === 'ANGRY' || sentiment === 'NEUTRAL') {
    return sentiment as Sentiment;
  }
  return Sentiment.UNKNOWN;
};

export const translateText = async (text: string, targetLang: 'English' | 'Nepali'): Promise<string> => {
  const sourceLang = targetLang === 'English' ? 'Nepali' : 'English';
  const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Return only the translated text.\n\nText: "${text}"`;
  return generateContent(prompt);
};

export const generateReply = async (message: string): Promise<string> => {
  const prompt = `Generate a short, friendly, and appropriate reply in Nepali for the following message. Return only the suggested reply text.\n\nMessage: "${message}"`;
  return generateContent(prompt);
};
