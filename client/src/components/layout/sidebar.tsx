import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Bot, 
  FileText, 
  MessageSquare, 
  Settings,
  Brain
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Business, User } from "@shared/schema";

export function Sidebar() {
  const [location] = useLocation();
  
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"]
  });

  const { data: business } = useQuery<Business>({
    queryKey: ["/api/business"]
  });

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      current: location === "/"
    },
    {
      name: "AI Agents",
      href: "/agents",
      icon: Bot,
      current: location === "/agents"
    },
    {
      name: "Documents",
      href: "/documents",
      icon: FileText,
      current: location === "/documents"
    },
    {
      name: "Feedback",
      href: "/feedback",
      icon: MessageSquare,
      current: location === "/feedback"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: location === "/settings"
    }
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-gray-900">
              {business?.name || "Demo Business Inc"}
            </h1>
            <p className="text-xs text-gray-600">
              AI-Powered Business Tools
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                      item.current
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        item.current ? "text-blue-700" : "text-gray-600"
                      )}
                    />
                    {item.name}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">
              {user?.username?.charAt(0).toUpperCase() || "B"}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {user?.username || "brad"}
            </p>
            <p className="text-xs text-gray-600">
              {user?.email || "user@business.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
