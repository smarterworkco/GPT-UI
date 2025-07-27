import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AgentChat() {
  const [location] = useLocation();
  const [agentType, setAgentType] = useState("general");
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const agent = params.get("agent");
    if (agent) setAgentType(agent);
  }, [location]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, `🧑 You: ${userMessage}`]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentType, prompt: userMessage }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, `🤖 ${data.reply || "No reply"}`]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, "❌ Error talking to agent"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chat with {agentType}</h1>

      <Card className="p-4 mb-4 min-h-[300px]">
        {messages.length === 0 ? (
          <p className="text-gray-500">Start a conversation…</p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, i) => (
              <p key={i} className="whitespace-pre-wrap">
                {msg}
              </p>
            ))}
          </div>
        )}
      </Card>

      <div className="flex gap-2">
        <Input
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <Button onClick={sendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
