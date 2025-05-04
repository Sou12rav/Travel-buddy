import { useState, ReactNode } from "react";

interface SuggestionChip {
  id: string;
  label: string;
  bgColor: string;
  textColor: string;
  icon?: ReactNode;
  onClick?: () => void;
}

interface SuggestionChipsProps {
  suggestions: SuggestionChip[];
}

export default function SuggestionChips({ suggestions }: SuggestionChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          className={`suggestion-chip ${suggestion.bgColor} ${suggestion.textColor} border border-gray-200`}
          onClick={suggestion.onClick}
        >
          {suggestion.icon && <span className="mr-1">{suggestion.icon}</span>}
          {suggestion.label}
        </button>
      ))}
    </div>
  );
}

// Pre-defined suggestion sets
export function WelcomeSuggestions({ onSelect }: { onSelect: (suggestion: string) => void }) {
  const suggestions: SuggestionChip[] = [
    {
      id: "explore",
      label: "Explore nearby",
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      onClick: () => onSelect("What are some interesting places nearby?")
    },
    {
      id: "plan",
      label: "Plan my day",
      bgColor: "bg-secondary/10",
      textColor: "text-secondary",
      onClick: () => onSelect("Help me plan my day in this city.")
    },
    {
      id: "ride",
      label: "Book a ride",
      bgColor: "bg-accent/10",
      textColor: "text-accent",
      onClick: () => onSelect("I need a ride to a tourist spot.")
    },
    {
      id: "safety",
      label: "Safety info",
      bgColor: "bg-light",
      textColor: "text-medium",
      onClick: () => onSelect("Is it safe to travel here right now?")
    }
  ];

  return <SuggestionChips suggestions={suggestions} />;
}

export function HotelSuggestions({ onSelect }: { onSelect: (suggestion: string) => void }) {
  const suggestions: SuggestionChip[] = [
    {
      id: "book",
      label: "Book Heaven Stay",
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      onClick: () => onSelect("Book me a room at Heaven Stay Hotel.")
    },
    {
      id: "availability",
      label: "Check availability",
      bgColor: "bg-light",
      textColor: "text-medium",
      onClick: () => onSelect("Check if the hotels have available rooms.")
    },
    {
      id: "map",
      label: "Show on map",
      bgColor: "bg-light",
      textColor: "text-medium",
      onClick: () => onSelect("Show these hotels on the map.")
    }
  ];

  return <SuggestionChips suggestions={suggestions} />;
}
