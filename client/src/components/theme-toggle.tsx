import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      variant={theme === "dark" ? "outline" : "ghost"}
      size="icon" 
      className={`rounded-full transition-all duration-300 ${
        theme === "dark" 
          ? "bg-purple-900/30 border-purple-400/30 hover:bg-purple-800/40 hover:border-purple-400/40" 
          : "hover:bg-blue-100/80"
      } ${className}`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-300 transition-transform hover:rotate-45 duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-blue-600 transition-transform hover:-rotate-12 duration-300" />
      )}
    </Button>
  );
}

// More elaborate version with tooltip for larger screens
export function ThemeToggleLarge({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      variant={theme === "dark" ? "outline" : "ghost"}
      size="sm"
      className={`rounded-full transition-all duration-300 ${
        theme === "dark" 
          ? "bg-purple-900/30 border-purple-400/30 hover:bg-purple-800/40 hover:border-purple-400/40" 
          : "hover:bg-blue-100/80"
      } ${className}`}
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-4 w-4 text-yellow-300 mr-2" />
          <span className="text-xs">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-xs">Dark Mode</span>
        </>
      )}
    </Button>
  );
}