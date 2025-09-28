import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This would be replaced with actual authentication
    // For now, using a simple password check
    if (password === "CS2024Admin") {
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      });
      // Store auth state (would use proper auth with backend)
      sessionStorage.setItem("adminAuth", "true");
      navigate("/admin-neville-2024");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid password",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-admin-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-admin-card border border-admin-border rounded-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="p-3 bg-admin-accent/20 rounded-full">
              <Shield className="w-8 h-8 text-admin-accent" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2 text-admin-foreground">
            Admin Access
          </h1>
          <p className="text-center text-admin-foreground/60 mb-8">
            Enter your admin password to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-admin-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-admin-foreground/40" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-admin-background border-admin-border text-admin-foreground placeholder:text-admin-foreground/40"
                  placeholder="Enter admin password"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-admin-accent hover:bg-admin-accent/90 text-white"
            >
              {isLoading ? "Authenticating..." : "Login to Admin Panel"}
            </Button>
          </form>

          <p className="text-xs text-center mt-6 text-admin-foreground/40">
            This is a secure admin area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};