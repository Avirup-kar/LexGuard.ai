import OpenAI from "openai";

const AI = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function searchExperts(contractData: any) {
  try {

    const dangerClauses = contractData.clauses
      .filter((c: any) => c.riskLevel === "danger")
      .map((c: any) => c.title)
      .slice(0, 2)
      .join(" ");

    const query = `best lawyer for ${contractData.contractTitle} ${dangerClauses} India contact details`;

    const serpRes = await fetch(
      `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&location=India&api_key=${process.env.SERPAPI_KEY}`
    );
    const serpData = await serpRes.json();

    if (!serpData.organic_results || serpData.organic_results.length === 0) return [];

    const rawItems = serpData.organic_results.slice(0, 5);

    const prompt = `
You are a data extraction API.
Extract contact details from the given search results.

STRICT RULES:
- Use ONLY the provided JSON data
- DO NOT guess or generate anything
- phone/email must come ONLY from "snippet"
- If phone/email not found → null
- name → from "title"
- website → from "link"
- description → short summary from snippet
- id must be sequential starting from 1

OUTPUT RULES:
- Return ONLY valid JSON
- NO explanation, NO text, NO markdown
- MUST be a JSON array
- Each object MUST follow this exact structure:
[
  {
    "id": 1,
    "name": "",
    "website": "",
    "phone": null,
    "email": null,
    "description": ""
  }
]
IMPORTANT:
- phone and email MUST be either string OR null (NOT "")
Search Results:
${JSON.stringify(rawItems, null, 2)}
`;

    const aiRes = await AI.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 1000,
    });

    const text = aiRes?.choices[0]?.message.content?.trim() ?? "";
    const clean = text.replace(/```json|```/g, "").trim();

    // ✅ SAFE PARSE
    let parsed = [];
    try {
      parsed = JSON.parse(clean);
    } catch (e) {
      console.error("❌ JSON parse failed:", e);
      // 🔥 Fallback - use raw SerpAPI data
      return rawItems.map((item: any, index: number) => ({
        id: index + 1,
        name: item.title,
        website: item.link,
        phone: null,
        email: null,
        description: item.snippet,
      }));
    }

    return parsed;

  } catch (err) {
    console.error("searchExperts error:", err);
    return [];
  }
}