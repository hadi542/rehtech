
import { GoogleGenAI, Type } from '@google/genai';
import { Transaction } from '../types';

const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string), vertexai: true });

export const getFinancialInsights = async (transactions: Transaction[]) => {
  try {
    const summary = transactions.map(t => 
      `${t.date}: ${t.type} of ${t.amount} in ${t.category} (${t.description})`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [{
          text: `Analyze these transactions and provide 3 actionable financial insights in JSON format:
          ${summary}`
        }]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return [
      { title: 'Cashflow Analysis', description: 'Start tracking your expenses to see detailed AI insights here.' },
      { title: 'Savings Potential', description: 'We will identify cost-cutting areas once you add your first few transactions.' }
    ];
  }
};

export const getLoanAdvice = async (income: number, emi: number, score: number, purpose: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [{
          text: `Provide loan advice for: Income: ${income}, Existing EMI: ${emi}, Credit Score: ${score}, Purpose: ${purpose}. 
          Return JSON with: safeEmiRange (string), riskLevel (Low/Medium/High), affordabilityScore (0-100), strategy (string).`
        }]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safeEmiRange: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
            affordabilityScore: { type: Type.NUMBER },
            strategy: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return {
      safeEmiRange: 'N/A',
      riskLevel: 'Unknown',
      affordabilityScore: 0,
      strategy: 'Please try again later for AI analysis.'
    };
  }
};

export const getCreditTips = async (score: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [{
          text: `Provide 3 tips to improve a credit score of ${score}. Return JSON array of strings.`
        }]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return ["Pay bills on time", "Keep credit utilization low", "Avoid frequent hard inquiries"];
  }
};
