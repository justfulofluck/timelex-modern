
import { GoogleGenAI } from "@google/genai";
import { Task, Project, Client, AIConfig } from "../types";

export async function getSmartInsights(
  tasks: Task[],
  projects: Project[],
  clients: Client[],
  config?: AIConfig
) {
  const context = `
    I have a list of time tracking tasks: ${JSON.stringify(tasks)}.
    Projects: ${JSON.stringify(projects)}.
    Clients: ${JSON.stringify(clients)}.
    Please provide a brief, professional summary of productivity trends and financial insights.
    Focus on which project is most profitable and any time management tips.
  `;

  // Use Custom API if configured
  if (config?.useCustom && config.endpoint) {
    try {
      // Normalize endpoint: ensure it ends with /chat/completions if it's a base URL
      let url = config.endpoint.replace(/\/$/, ''); // remove trailing slash
      if (!url.endsWith('/chat/completions')) {
        url = `${url}/chat/completions`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || "gpt-3.5-turbo", // Default to gpt-3.5-turbo if not set, though Z.ai needs specific model
          messages: [
            {
              role: "system",
              content: "You are a professional business consultant specializing in time management and freelance finances. Keep your response concise and formatted as markdown."
            },
            {
              role: "user",
              content: context
            }
          ],
          stream: false
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Temporal drift detected: ${response.status} - ${errText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || data.text || "Insight retrieved, but format was unexpected.";
    } catch (error: any) {
      console.error("Custom API Error:", error);
      return `Custom API communication failed: ${error.message}`;
    }
  }

  // Fallback to Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
