import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const courses = [
  { value: "cs", label: "Computer Science" },
  { value: "math", label: "Mathematics" },
  { value: "physics", label: "Physics" },
  { value: "eng", label: "Engineering" },
  { value: "bio", label: "Biology" },
];

const years = [
  { value: "1", label: "Year 1" },
  { value: "2", label: "Year 2" },
  { value: "3", label: "Year 3" },
  { value: "4", label: "Year 4" },
];

export const CourseSelector = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const handleNavigate = () => {
    if (selectedCourse && selectedYear) {
      navigate(`/resources/${selectedCourse}/${selectedYear}`);
    }
  };

  return (
    <div className="glass-card p-8 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold">Select Your Course</h2>
      </div>
      
      <div className="space-y-4">
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-full h-12 bg-muted/50 border-white/20 hover:border-primary/50 transition-colors">
            <SelectValue placeholder="Choose your course" />
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-xl border-white/20">
            {courses.map((course) => (
              <SelectItem 
                key={course.value} 
                value={course.value}
                className="hover:bg-primary/10 focus:bg-primary/20"
              >
                {course.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full h-12 bg-muted/50 border-white/20 hover:border-primary/50 transition-colors">
            <SelectValue placeholder="Select your year" />
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-xl border-white/20">
            {years.map((year) => (
              <SelectItem 
                key={year.value} 
                value={year.value}
                className="hover:bg-primary/10 focus:bg-primary/20"
              >
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleNavigate}
          disabled={!selectedCourse || !selectedYear}
          className="w-full h-12 bg-gradient-primary hover:opacity-90 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
        >
          <span className="font-semibold">Access Resources</span>
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};