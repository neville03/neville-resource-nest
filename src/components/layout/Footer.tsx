import { Heart, ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="glass-card border-t border-white/10 mt-20 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Created with</span>
            <Heart className="w-4 h-4 text-primary animate-pulse-glow" />
            <span>by Neville Akoragye, CS Year 2</span>
          </div>
          
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground/70">
            <ExternalLink className="w-3 h-3" />
            <span>External book links lead to legally available educational resources</span>
          </div>
          
          <div className="flex justify-center gap-6 text-sm">
            <a 
              href="/about" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </a>
            <a 
              href="/suggest" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Suggestions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};