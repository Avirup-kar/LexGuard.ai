import OpenAI from "openai";

const AI = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

interface Clause {
  id: number;
  title: string;
  originalText: string;
  riskLevel: "safe" | "medium" | "danger";
  plainEnglish: string | null;
  consequence: string | null;
  solution: string | null;
}

interface ContractAnalysis {
  contractTitle: string;
  overallRisk: "low" | "medium" | "high";
  overallSummary: string;
  clauses: Clause[];
  missingClauses: string[] | null;
}

const parseGroqResponse = (rawText: string): ContractAnalysis => {
  try {
    const cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error("Gemini returned invalid JSON — try uploading a clearer image");
  }
};

export const analyzeContractImage = async (
  contractText: string,
): Promise<ContractAnalysis> => {
  try {
    const prompt = `
You are a legal contract analyzer. Analyze the contract text below.
Return ONLY a valid JSON object. No explanation, no markdown, no extra text, no comments.
Just raw JSON in this exact structure:

{
  "contractTitle": "string",
  "overallRisk": "low | medium | high",
  "overallSummary": "string",
  "clauses": [
    {
      "id": 1,
      "title": "string",
      "originalText": "string",
      "riskLevel": "safe | medium | danger",
      "plainEnglish": "string or null",
      "consequence": "string or null",
      "solution": "string or null"
    }
  ],
  "missingClauses": ["string"] | null
}

Rules:
- Analyze ONLY from the contractor's perspective — identify risks and protections for the contractor, not the client's perspective
- id must be sequential starting from 1
- riskLevel must be exactly: "safe", "medium", or "danger"
- if riskLevel is "safe" then consequence and solution must be null but plainEnglish should not be null
- solution must be null if riskLevel is "safe"
- originalText must be the exact clause text copied from the contract
- plainEnglish must be in very simple language a non-lawyer can understand and in easy word
- missingClauses must be null if none; otherwise return a list in format "Title - short explanation" (not just one word)
- Return absolutely nothing except the JSON object

Contract text:
${contractText}
    `;

    const response = await AI.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
       max_tokens: 8000,
    });

    const content = response.choices[0]?.message.content!;
    return parseGroqResponse(content);

  } catch (error: any) {
    console.log(error.status)   // what status code?
    console.log(error.message)  // what exact message?
    console.log(error)  
    if (error.status === 400) {
      throw new Error("Invalid request — make sure the contract text is readable");
    }

    if (error.status === 429) {
      throw new Error("Too many requests — please wait a moment and try again");
    }

    if (error.status === 403) {
      throw new Error("Invalid API key — check your GEMINI_API_KEY in .env");
    }

    if (error instanceof SyntaxError) {
      throw new Error("Gemini could not analyze this document — try again");
    }

    throw new Error(error.message || "Failed to analyze contract");
  }
};