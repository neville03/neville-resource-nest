import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function SetupAdmin() {
  const [email, setEmail] = useState("akoneville1@gmail.com");
  const [password, setPassword] = useState("CS2024Admin");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createAdmin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-admin', {
        body: { email, password }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Admin account created for ${email}. You can now log in at /admin/login`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create admin account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Admin Account</CardTitle>
          <CardDescription>
            Set up your first admin account to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
            />
          </div>
          <Button 
            onClick={createAdmin} 
            disabled={loading || !email || !password}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Admin Account"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            After creating your account, you can log in at{" "}
            <a href="/admin/login" className="text-primary hover:underline">
              /admin/login
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
