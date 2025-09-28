import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, MessageSquarePlus } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <GraduationCap className="w-7 h-7 text-primary" />
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            ResourceHub
          </span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link to="/suggest">
            <Button
              variant="outline"
              className="border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300"
            >
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              Suggest Resource
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};