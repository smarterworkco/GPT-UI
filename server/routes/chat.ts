// server/routes/chat.ts

import express from "express";
import { z } from "zod";
import { OpenAI } from "openai";

const router = express.Router();

// Schema to validate request body
const schema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This should be stored in .env
});

router.post("/", async (req, res) => {
  const parse = schema.safeParse(req.body);

  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors });
  }

  const { prompt } = parse.data;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful business advisor." },
        { role: "user", content: prompt },
      ],
    });

    const reply = chatResponse.choices[0]?.message?.content || "No response";

    res.status(200).json({ reply });
  } catch (err: any) {
    console.error("OpenAI error:", err.message);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
});

export default router;
