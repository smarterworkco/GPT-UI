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
    <div className="flex h-full w-64 flex-col bg-sidebar">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-sidebar-border">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-sidebar-foreground">
              {business?.name || "Demo Business Inc"}
            </h1>
            <p className="text-xs text-sidebar-foreground/70">
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
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        item.current ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/70"
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
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">
              {user?.username?.charAt(0).toUpperCase() || "B"}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-sidebar-foreground">
              {user?.username || "brad"}
            </p>
            <p className="text-xs text-sidebar-foreground/70">
              brad@businesssystems.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
