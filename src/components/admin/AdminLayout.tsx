import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileUp, 
  MessageSquare, 
  Link2,
  LogOut,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/admin-neville-2024", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin-neville-2024/content", label: "Content", icon: FileUp },
  { path: "/admin-neville-2024/suggestions", label: "Suggestions", icon: MessageSquare },
  { path: "/admin-neville-2024/links", label: "External Links", icon: Link2 },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();

  const handleLogout = () => {
    // Logout functionality would be implemented with backend
    console.log("Logging out...");
  };

  return (
    <div className="min-h-screen bg-admin-background text-admin-foreground">
      {/* Admin Header */}
      <header className="bg-admin-card border-b border-admin-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-admin-accent" />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-admin-foreground hover:bg-admin-accent/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-admin-card border-b border-admin-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-admin-foreground hover:bg-admin-accent/20",
                      isActive && "bg-admin-accent/30 text-admin-accent"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};