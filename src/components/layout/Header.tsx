import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, MessageSquarePlus } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <GraduationCap className="w-7 h-7 text-primary" />
          <span className="text-gray-800 font-heading">ResourceHub</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/suggest">
            <Button className="btn-primary flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4" />
              Suggest Resource
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};