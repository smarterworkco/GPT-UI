import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/use-chat";
import { agentConfigs } from "@/lib/types";
import { Bot, User, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatModal() {
  const [message, setMessage] = useState("");
  const { 
    isOpen, 
    currentAgent, 
    messages, 
    closeChat, 
    sendMessage, 
    isLoading 
  } = useChat();

  const agentConfig = agentConfigs[currentAgent];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const messageToSend = message;
    setMessage("");
    await sendMessage(messageToSend);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeChat()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="bg-primary text-primary-foreground px-6 py-4 flex-row items-center justify-between space-y-0">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl"
              style={{ backgroundColor: agentConfig?.color }}
            >
              {agentConfig?.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{agentConfig?.name}</h3>
              <p className="text-sm text-primary-foreground/80">
                {agentConfig?.description}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeChat}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6 bg-gray-50">
          <div className="space-y-4">
            {/* Welcome message */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-white rounded-lg rounded-tl-none p-4 shadow-sm max-w-md">
                <p className="text-gray-800">
                  Hello! I'm your {agentConfig?.name}. How can I help you today?
                </p>
              </div>
            </div>

            {/* Chat messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start space-x-3",
                  msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                )}
              >
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    msg.role === "user" 
                      ? "bg-gray-300" 
                      : "bg-primary/10"
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4 text-gray-600" />
                  ) : (
                    <Bot className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-lg p-4 shadow-sm max-w-md",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-white text-gray-800 rounded-tl-none"
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-white rounded-lg rounded-tl-none p-4 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-6">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
