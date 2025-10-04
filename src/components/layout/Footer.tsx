import { Heart, ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span>Created with</span>
            <Heart className="w-4 h-4 text-primary" />
            <span>by Neville Akoragye, CS Year 2</span>
            <span>Copyright 2025. All rights reserved.</span>
          </div>
          
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
            <ExternalLink className="w-3 h-3" />
            <span>External book links lead to legally available educational resources</span>
            <span>Copyright 2025. All rights reserved.</span>
          </div>
          
          <div className="flex justify-center gap-6 text-sm">
            <a 
              href="/about" 
              className="text-gray-500 hover:text-primary transition-colors"
            >
              About
            </a>
            <a 
              href="/suggest" 
              className="text-gray-500 hover:text-primary transition-colors"
            >
              Suggestions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
