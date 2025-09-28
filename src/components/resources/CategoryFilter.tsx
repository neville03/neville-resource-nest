import { Button } from "@/components/ui/button";
import { FileText, BookOpen, StickyNote, Presentation } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { value: "all", label: "All Resources", icon: null },
  { value: "past-papers", label: "Past Papers", icon: FileText },
  { value: "notes", label: "Study Notes", icon: StickyNote },
  { value: "slides", label: "Lecture Slides", icon: Presentation },
  { value: "books", label: "Book Links", icon: BookOpen },
];

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Button
            key={category.value}
            variant="outline"
            size="sm"
            onClick={() => onCategoryChange(category.value)}
            className={cn(
              "border-gray-200 hover:bg-gray-50 transition-all",
              selectedCategory === category.value && "bg-primary text-white border-primary hover:bg-primary-hover"
            )}
          >
            {Icon && <Icon className="w-4 h-4 mr-2" />}
            {category.label}
          </Button>
        );
      })}
    </div>
  );
};