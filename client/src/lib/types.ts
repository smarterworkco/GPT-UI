export type AgentType = "general" | "sop" | "compliance" | "social";

export interface AgentConfig {
  type: AgentType;
  name: string;
  description: string;
  icon: string;
  color: string;
  colorClass: string;
}

export const agentConfigs: Record<AgentType, AgentConfig> = {
  general: {
    type: "general",
    name: "General Business AI",
    description: "Strategic planning, general business advice, and operational guidance",
    icon: "✨",
    color: "hsl(271, 91%, 65%)",
    colorClass: "agent-general"
  },
  sop: {
    type: "sop",
    name: "SOP Assistant",
    description: "Create, update, and optimize standard operating procedures",
    icon: "📋",
    color: "hsl(217, 91%, 60%)",
    colorClass: "agent-sop"
  },
  compliance: {
    type: "compliance",
    name: "Regulatory Compliance",
    description: "Ensure compliance with industry regulations and policies",
    icon: "🛡️",
    color: "hsl(142, 76%, 36%)",
    colorClass: "agent-compliance"
  },
  social: {
    type: "social",
    name: "Social Media Manager",
    description: "Content creation, scheduling, and social media strategy",
    icon: "📱",
    color: "hsl(24, 95%, 53%)",
    colorClass: "agent-social"
  }
};

export interface BusinessMetrics {
  totalDocuments: number;
  recentUpdates: number;
  aiInteractions: number;
}
