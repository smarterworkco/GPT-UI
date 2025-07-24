import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useChat } from "@/hooks/use-chat";
import { Business, User, Document } from "@shared/schema";
import { BusinessMetrics, agentConfigs, AgentType } from "@/lib/types";
import { 
  FileText, 
  TrendingUp, 
  Bot, 
  Upload, 
  MessageSquare, 
  UserCog,
  Clock,
  Zap
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { openChat } = useChat();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"]
  });

  const { data: business } = useQuery<Business>({
    queryKey: ["/api/business"]
  });

  const { data: metrics } = useQuery<BusinessMetrics>({
    queryKey: ["/api/analytics/metrics"]
  });

  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ["/api/documents"]
  });

  const recentDocuments = documents
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 3);

  const handleStartChat = (agentType: AgentType) => {
    openChat(agentType);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.username || "User"}
        </h1>
        <p className="text-gray-600 mt-1">
          Managing {business?.name || "Your Business"}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Total Documents</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {metrics?.totalDocuments || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Recent Updates</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {metrics?.recentUpdates || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">AI Interactions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {metrics?.aiInteractions || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Assistants Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Your AI Business Assistants
          </h2>
          <div className="space-y-4">
            {Object.values(agentConfigs).map((agent) => (
              <Card key={agent.type} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xl"
                      style={{ backgroundColor: agent.color }}
                    >
                      {agent.icon}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {agent.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {agent.description}
                      </p>
                      <Button
                        variant="link"
                        className="mt-3 p-0 h-auto text-primary hover:text-primary/80"
                        onClick={() => handleStartChat(agent.type)}
                      >
                        Start Chat →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions & Recent Documents */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-500" />
              Quick Actions
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Link href="/documents">
                    <Button className="w-full" size="lg">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </Link>
                  <Link href="/agents">
                    <Button variant="outline" className="w-full" size="lg">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Start AI Chat
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="outline" className="w-full" size="lg">
                      <UserCog className="mr-2 h-4 w-4" />
                      Setup Business Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Documents */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
                Recent Documents
              </h2>
              <Link href="/documents">
                <Button variant="link" className="p-0 h-auto">
                  View All
                </Button>
              </Link>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentDocuments.length > 0 ? (
                    recentDocuments.map((document) => (
                      <div key={document.id} className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {document.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {document.category}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No documents yet. Upload your first document to get started.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
