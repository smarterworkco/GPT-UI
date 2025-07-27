// server/test-openai.ts
import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ make sure .env is correctly set
});

async function testChat() {
  const chat = await openai.chat.completions.create({
    model: "gpt-4", // or "gpt-3.5-turbo"
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "What's the capital of France?" },
    ],
  });

  console.log("🧠 Response:", chat.choices[0].message.content);
}

testChat().catch((err) => {
  console.error("❌ OpenAI Test Error:", err);
});
