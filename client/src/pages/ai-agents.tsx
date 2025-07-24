import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";
import { agentConfigs, AgentType } from "@/lib/types";

export default function AIAgents() {
  const { openChat } = useChat();

  const handleSelectAgent = (agentType: AgentType) => {
    openChat(agentType);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Business Assistants</h1>
        <p className="text-gray-600 mt-1">Choose your specialized AI assistant to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(agentConfigs).map((agent) => (
          <Card 
            key={agent.type} 
            className="hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => handleSelectAgent(agent.type)}
          >
            <CardContent className="p-8">
              <div className="flex items-start">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-2xl"
                  style={{ backgroundColor: agent.color }}
                >
                  {agent.icon}
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {agent.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {agent.description}
                  </p>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAgent(agent.type);
                    }}
                  >
                    Start Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
