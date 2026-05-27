import { getAuth } from "@clerk/express";
import { type Request, type Response } from "express";
import fetch from "node-fetch";

type TranslateResponse = {
  translatedText: string[];
};

const translateBatch = async (texts: string[], target: string) => {
  const res = await fetch("http://localhost:5000/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: texts,
      source: "en",
      target,
    }),
  });

  const data = (await res.json()) as TranslateResponse;

  // 🔥 FIX: ensure always array
  if (Array.isArray(data.translatedText)) {
    return data.translatedText;
  }

  // ❗ fallback (API returned single string)
  return texts.map(() => data.translatedText);
};

const Translate = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const { clause, lang } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User unauthorised to access." });
    }

    if (!clause || !lang) {
      return res.status(400).json({ error: "Missing data" });
    }

    // 🔥 ONE request instead of 5
    const texts = [
      clause.title,
      clause.originalText,
      clause.plainEnglish || "",
      clause.consequence || "",
      clause.solution || "",
    ];

    const [
      title,
      originalText,
      plainEnglish,
      consequence,
      solution,
    ] = await translateBatch(texts, lang);

    const translatedClause = {
      id: clause.id,
      riskLevel: clause.riskLevel,
      title,
      originalText,
      plainEnglish,
      consequence,
      solution,
    };

    res.json(translatedClause);
  } catch (err) {
    console.error("Translation error:", err);
    res.status(500).json({ error: "Translation failed" });
  }
};

export default Translate;
