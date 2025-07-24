import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ChatSession, ChatMessage, InsertChatSession, InsertChatMessage } from "@shared/schema";
import { AgentType } from "@/lib/types";

export function useChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<AgentType>("general");
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const queryClient = useQueryClient();

  const createSessionMutation = useMutation({
    mutationFn: async (data: InsertChatSession) => {
      const response = await apiRequest("POST", "/api/chat/sessions", data);
      return response.json() as Promise<ChatSession>;
    },
    onSuccess: (session) => {
      setCurrentSession(session);
      queryClient.invalidateQueries({ queryKey: ["/api/chat/sessions"] });
    }
  });

  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/sessions", currentSession?.id, "messages"],
    enabled: !!currentSession?.id
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: InsertChatMessage) => {
      const response = await apiRequest(
        "POST", 
        `/api/chat/sessions/${currentSession?.id}/messages`, 
        data
      );
      return response.json() as Promise<ChatMessage>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/chat/sessions", currentSession?.id, "messages"] 
      });
    }
  });

  const openChat = async (agentType: AgentType) => {
    setCurrentAgent(agentType);
    setIsOpen(true);
    
    // Create new session
    createSessionMutation.mutate({ agentType });
  };

  const closeChat = () => {
    setIsOpen(false);
    setCurrentSession(null);
  };

  const sendMessage = async (content: string) => {
    if (!currentSession) return;

    // Send user message
    await sendMessageMutation.mutateAsync({
      sessionId: currentSession.id,
      role: "user",
      content
    });

    // Generate AI response (mock for now)
    const aiResponseContent = generateAIResponse(content, currentAgent);
    
    setTimeout(async () => {
      await sendMessageMutation.mutateAsync({
        sessionId: currentSession.id,
        role: "assistant",
        content: aiResponseContent
      });
    }, 1000);
  };

  return {
    isOpen,
    currentAgent,
    currentSession,
    messages,
    openChat,
    closeChat,
    sendMessage,
    isLoading: createSessionMutation.isPending || sendMessageMutation.isPending
  };
}

function generateAIResponse(userMessage: string, agentType: AgentType): string {
  const responses: Record<AgentType, string[]> = {
    general: [
      "I understand you're looking for business guidance. Let me help you analyze this situation and provide strategic recommendations.",
      "Based on best practices in business operations, here's what I recommend for your situation.",
      "This is an interesting business challenge. Let me break down the key factors to consider and suggest a path forward."
    ],
    sop: [
      "For creating or updating SOPs, I recommend following a structured approach. Let me outline the key steps for your procedure.",
      "When documenting procedures, it's important to be clear and specific. Here's how we can improve your process documentation.",
      "I can help you standardize this procedure. Let's break it down into clear, actionable steps that your team can follow."
    ],
    compliance: [
      "Regarding compliance requirements, let me review the relevant regulations and provide guidance on how to ensure your processes meet all necessary standards.",
      "Compliance is critical for your business. Based on current regulations, here are the key areas you need to address.",
      "I'll help you navigate the regulatory landscape. Let me outline the compliance requirements specific to your industry and situation."
    ],
    social: [
      "For your social media strategy, I recommend focusing on content that engages your target audience. Let me suggest some approaches.",
      "Social media success requires consistent, valuable content. Here's how we can improve your social media presence and engagement.",
      "I can help you develop a comprehensive social media strategy. Let's start by identifying your key messaging and content themes."
    ]
  };

  const agentResponses = responses[agentType];
  const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];
  
  return `${randomResponse}\n\nYou mentioned: "${userMessage}"\n\nThis requires careful consideration of several factors. Would you like me to elaborate on any specific aspect?`;
}
