import OpenAI from "openai";

const AI = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export const createRowEmail = async (contractData: any) => {
  try {
    const prompt = `
You are a legal assistant AI.

Generate a professional negotiation email based on the contract analysis.

STRICT RULES:
- Return ONLY valid JSON
- Do NOT include explanations or extra text
- Output must contain exactly: subject and body
- Keep tone professional, calm, and assertive
- Do NOT use placeholders like [Name]

FORMATTING RULES (VERY IMPORTANT):
- You MUST use line breaks using \\n
- Add TWO line breaks (\\n\\n) between each section
- Each "Clause", "Concern", and "Request" must be on separate lines
- Do NOT return everything in one paragraph
- If formatting is not followed, the response is INVALID

CONTRACT DATA:
${JSON.stringify(contractData, null, 2)}

INSTRUCTIONS:
- Ignore any clause where riskLevel is "safe"
- Only focus on "danger" and "medium" risk clauses
- Prioritize "danger" clauses first

EMAIL BODY FORMAT:

Start with a short professional opening

Clause:
"<originalText>"

Concern:
Explain the specific problem I might face.

Request:
State the safety change I want.

(Add TWO line breaks before the next clause)

Repeat for each clause

End with a short professional closing

OUTPUT FORMAT:
{
  "subject": "string",
  "body": "string"
}
`;

    const response = await AI.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 8000,
    });

    const content = response.choices[0]?.message.content;

    // ✅ Extract JSON safely
    const jsonMatch = content?.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;

    const cleanJson = jsonString!
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, " ") // removes bad chars but keeps \n and \r
    .trim();

    const emailData = JSON.parse(cleanJson);
    
    return emailData;
  } catch (error: any) {
    console.log(error.status);
    console.log(error.message);
    console.log(error);

    if (error.status === 400) {
      throw new Error("Invalid request — make sure the contract text is readable");
    }

    if (error.status === 429) {
      throw new Error("Too many requests — please wait a moment and try again");
    }

    if (error.status === 403) {
      throw new Error("Invalid API key — check your GROQ_API_KEY in .env");
    }

    throw new Error(error.message || "Failed to generate email");
  }
};