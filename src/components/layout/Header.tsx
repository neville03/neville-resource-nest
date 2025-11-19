import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, MessageSquarePlus, Menu, LogIn, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <GraduationCap className="w-7 h-7 text-primary" />
          <span className="text-gray-800 font-heading">NEST</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/community" className="text-gray-600 hover:text-primary transition-colors">
            Community
          </Link>
          <Link to="/study-assistant" className="text-gray-600 hover:text-primary transition-colors">
            Study Assistant
          </Link>
          <Link to="/suggest">
            <Button className="btn-primary flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4" />
              Suggest Resource
            </Button>
          </Link>
          {user ? (
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Button onClick={() => navigate("/auth")} variant="outline" size="sm">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6 text-gray-800" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <nav className="flex flex-col gap-4 mt-8">
              <Link 
                to="/about" 
                className="text-gray-600 hover:text-primary transition-colors py-2"
                onClick={() => setOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/community" 
                className="text-gray-600 hover:text-primary transition-colors py-2"
                onClick={() => setOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/study-assistant" 
                className="text-gray-600 hover:text-primary transition-colors py-2"
                onClick={() => setOpen(false)}
              >
                Study Assistant
              </Link>
              <Link to="/suggest" onClick={() => setOpen(false)}>
                <Button className="btn-primary flex items-center gap-2 w-full">
                  <MessageSquarePlus className="w-4 w-4" />
                  Suggest Resource
                </Button>
              </Link>
              {user ? (
                <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full mt-4">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <Button onClick={() => navigate("/auth")} variant="outline" size="sm" className="w-full mt-4">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};