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
  { value: "se", label: "Software Engineering" },
  { value: "ist", label: "Information Systems and Technology" },
  { value: "lis", label: "Library and Information Science" },
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
    <div className="relative bg-gradient-to-br from-primary/5 via-white to-accent/5 p-8 sm:p-10 rounded-2xl shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl animate-fade-in">
      {/* Decorative elements */}
      <div className="absolute -top-3 -right-3 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-3 -left-3 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <BookOpen className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Select Your Course
          </h2>
        </div>
        
        <div className="space-y-5">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Course</label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full h-14 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-primary hover:bg-white transition-all duration-300 text-base font-medium group-hover:shadow-md">
                <SelectValue placeholder="Choose your course" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-primary/20 animate-slide-down">
                {courses.map((course) => (
                  <SelectItem 
                    key={course.value} 
                    value={course.value}
                    className="font-semibold text-base text-foreground hover:bg-primary/10 focus:bg-primary/15 data-[highlighted]:bg-primary/10 data-[highlighted]:text-foreground cursor-pointer py-3"
                  >
                    {course.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full h-14 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-accent hover:bg-white transition-all duration-300 text-base font-medium group-hover:shadow-md">
                <SelectValue placeholder="Select your year" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-accent/20 animate-slide-down">
                {years.map((year) => (
                  <SelectItem 
                    key={year.value} 
                    value={year.value}
                    className="font-semibold text-base text-foreground hover:bg-accent/10 focus:bg-accent/15 data-[highlighted]:bg-accent/10 data-[highlighted]:text-foreground cursor-pointer py-3"
                  >
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleNavigate}
            disabled={!selectedCourse || !selectedYear}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-2"
          >
            <span>Access Resources</span>
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};