import { useState, FormEvent } from "react";
import { Send, Plus, Mic } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
}

export default function ChatInput({ onSendMessage, isTyping = false }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !isTyping) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="p-2 bg-white border-t">
      <form 
        onSubmit={handleSubmit} 
        className="flex items-center bg-light rounded-full px-4 py-2"
      >
        <button 
          type="button" 
          className="mr-2 text-medium"
          disabled={isTyping}
        >
          <Plus size={20} />
        </button>
        
        <input 
          type="text" 
          placeholder="Message Buddy..." 
          className="flex-1 bg-transparent outline-none text-dark"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isTyping}
        />
        
        <button 
          type="button" 
          className="mx-2 text-medium"
          disabled={isTyping}
        >
          <Mic size={20} />
        </button>
        
        <button 
          type="submit" 
          className={`text-primary ${(!message.trim() || isTyping) ? 'opacity-50' : ''}`}
          disabled={!message.trim() || isTyping}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
