import express from "express";
import { askClaude } from "../ai/openrouter";

const router = express.Router();

router.post("/insights", async (req, res) => {
  const { financials, industry, language } = req.body;

  const prompt = `
Industry: ${industry}
Language: ${language || "English"}

Financial Data:
${JSON.stringify(financials)}

Provide:
1. Financial health summary
2. Creditworthiness
3. Risk factors
4. Cost optimization
5. Bank/NBFC product suggestions
`;

  const insights = await askClaude(prompt);
  res.json({ insights });
});

export default router;
