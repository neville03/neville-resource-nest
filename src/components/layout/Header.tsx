import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, MessageSquarePlus, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export const Header = () => {
  const [open, setOpen] = useState(false);

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
          <Link to="/suggest">
            <Button className="btn-primary flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4" />
              Suggest Resource
            </Button>
          </Link>
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
              <Link to="/suggest" onClick={() => setOpen(false)}>
                <Button className="btn-primary flex items-center gap-2 w-full">
                  <MessageSquarePlus className="w-4 h-4" />
                  Suggest Resource
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};