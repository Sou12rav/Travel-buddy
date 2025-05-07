import { ChatMessage } from "../lib/types";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  
  // Function to format message content with line breaks
  const formatContent = (content: string) => {
    // Split by line breaks and wrap each line in a paragraph
    return content.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      return <p key={index} className={index > 0 ? "mt-2" : ""}>{line}</p>;
    });
  };

  return (
    <div className={`chat-message p-4 ${isUser ? 'user' : 'assistant'}`}>
      {formatContent(message.content)}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="chat-message assistant p-4">
      <p className="typing-indicator">Buddy is typing</p>
    </div>
  );
}
