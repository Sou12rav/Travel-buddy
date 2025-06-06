import { ChatMessage } from "../lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Copy, ThumbsUp, ThumbsDown, Code, MapPin, Calendar, Info } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Function to detect and format code blocks
  const formatContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/);
    
    return parts.map((part, index) => {
      // Check if it's a code block
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3);
        const [language, ...codeLines] = code.split('\n');
        const codeContent = codeLines.join('\n');
        
        return (
          <div key={index} className="my-3">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                <Badge variant="outline" className="text-xs">
                  {language || 'code'}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(codeContent);
                    toast({ title: "Code copied to clipboard" });
                  }}
                  className="h-6 px-2"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <pre className="p-4 text-sm text-green-400 overflow-x-auto">
                <code>{codeContent}</code>
              </pre>
            </div>
          </div>
        );
      }
      
      // Regular text with formatting
      return part.split('\n').map((line, lineIndex) => {
        if (line.trim() === '') return <br key={`${index}-${lineIndex}`} />;
        
        // Detect special formatting
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <h4 key={`${index}-${lineIndex}`} className="font-semibold text-lg mt-4 mb-2">
              {line.slice(2, -2)}
            </h4>
          );
        }
        
        if (line.startsWith('• ')) {
          return (
            <li key={`${index}-${lineIndex}`} className="ml-4 mb-1">
              {line.slice(2)}
            </li>
          );
        }
        
        return (
          <p key={`${index}-${lineIndex}`} className={lineIndex > 0 ? "mt-2" : ""}>
            {line}
          </p>
        );
      });
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({ title: "Message copied to clipboard" });
  };

  const handleFeedback = (helpful: boolean) => {
    setIsHelpful(helpful);
    toast({ 
      title: helpful ? "Thanks for your feedback!" : "We'll improve our responses",
      description: helpful ? "Glad this was helpful" : "Your feedback helps us get better"
    });
  };

  const getMessageIcon = () => {
    const content = message.content.toLowerCase();
    if (content.includes('github') || content.includes('vscode')) return <Code className="h-4 w-4" />;
    if (content.includes('destination') || content.includes('place')) return <MapPin className="h-4 w-4" />;
    if (content.includes('plan') || content.includes('itinerary')) return <Calendar className="h-4 w-4" />;
    return <Info className="h-4 w-4" />;
  };

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className={isUser ? "bg-blue-500 text-white" : "bg-green-500 text-white"}>
          {isUser ? "U" : "B"}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <Card className={`${isUser ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800'}`}>
          <CardContent className="p-4">
            {/* Message Header */}
            {!isUser && (
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                {getMessageIcon()}
                <span>Buddy AI Assistant</span>
                <Badge variant="outline" className="text-xs">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </Badge>
              </div>
            )}

            {/* Message Content */}
            <div className={`text-sm ${isUser ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
              {formatContent(message.content)}
            </div>

            {/* Action Buttons */}
            {!isUser && (
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="h-7 px-2 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFeedback(true)}
                    className={`h-7 px-2 ${isHelpful === true ? 'bg-green-100 text-green-700' : ''}`}
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFeedback(false)}
                    className={`h-7 px-2 ${isHelpful === false ? 'bg-red-100 text-red-700' : ''}`}
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User message timestamp */}
        {isUser && (
          <div className="text-xs text-gray-500 mt-1 text-right">
            {new Date(message.createdAt).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-green-500 text-white">
          B
        </AvatarFallback>
      </Avatar>

      {/* Typing Animation */}
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
            <Info className="h-4 w-4" />
            <span>Buddy AI Assistant</span>
            <Badge variant="outline" className="text-xs">thinking...</Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">Buddy is thinking...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
