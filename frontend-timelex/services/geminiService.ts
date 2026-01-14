
import { GoogleGenAI } from "@google/genai";
import { Task, Project, Client } from "../types";

export async function getSmartInsights(tasks: Task[], projects: Project[], clients: Client[]) {
  // Always use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const context = `
    I have a list of time tracking tasks: ${JSON.stringify(tasks)}.
    Projects: ${JSON.stringify(projects)}.
    Clients: ${JSON.stringify(clients)}.
    Please provide a brief, professional summary of productivity trends and financial insights.
    Focus on which project is most profitable and any time management tips.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: context,
      config: {
        systemInstruction: "You are a professional business consultant specializing in time management and freelance finances. Keep your response concise and formatted as markdown.",
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Unable to generate smart insights at this moment.";
  }
}
