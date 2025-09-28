import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, FileText, BookOpen, StickyNote, Presentation } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
  id: string;
  title: string;
  description?: string;
  category: "past-papers" | "notes" | "slides" | "books";
  type: "file" | "link";
  url?: string;
  size?: string;
  year?: string;
  semester?: string;
}

const categoryConfig = {
  "past-papers": {
    icon: FileText,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  notes: {
    icon: StickyNote,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
  },
  slides: {
    icon: Presentation,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  books: {
    icon: BookOpen,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
};

export const ResourceCard = ({ 
  title, 
  description, 
  category, 
  type, 
  url, 
  size, 
  year,
  semester 
}: ResourceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const config = categoryConfig[category];
  const Icon = config.icon;

  const handleAction = () => {
    if (type === "link" && url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (type === "file") {
      // File download would be handled here with backend integration
      console.log("Download file:", title);
    }
  };

  return (
    <div
      className={cn(
        "bg-white p-6 rounded-xl border border-gray-200 transition-all duration-300",
        "hover-lift hover:shadow-soft-lg",
        isHovered && "border-primary/30"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-lg", config.bgColor)}>
          <Icon className={cn("w-6 h-6", config.color)} />
        </div>
        
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {year && <span>Year: {year}</span>}
            {semester && <span>Semester: {semester}</span>}
            {size && <span>{size}</span>}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleAction}
          variant="outline"
          size="sm"
          className={cn(
            "border-gray-200 hover:bg-gray-50 transition-all",
            isHovered && "border-primary/30 text-primary"
          )}
        >
          {type === "link" ? (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Link
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download
            </>
          )}
        </Button>
      </div>
    </div>
  );
};