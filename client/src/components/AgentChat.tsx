import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AgentChat() {
  const [agentType, setAgentType] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const agent = params.get("agent");
    setAgentType(agent);
  }, [location]);

  const handleSend = async () => {
    if (!input.trim() || !agentType) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentType,
          messages: [...messages, userMessage],
        }),
      });

      const data = await res.json();
      const reply: Message = {
        role: "assistant",
        content: data.message || "No response received.",
      };

      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Chat with {agentType || "Agent"}
      </h1>

      <div className="border rounded p-4 bg-white h-[400px] overflow-y-auto mb-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-gray-100 text-left"
            }`}
          >
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-start">
        <Textarea
          rows={2}
          className="flex-1"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button disabled={loading || !input.trim()} onClick={handleSend}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
