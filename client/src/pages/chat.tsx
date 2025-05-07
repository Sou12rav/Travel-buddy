import { useState, useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "../lib/api_context";
import ChatBubble, { TypingIndicator } from "@/components/chat-bubble";
import ChatInput from "@/components/chat-input";
import { HotelSuggestions } from "@/components/suggestion-chips";
import { ArrowLeft, Mic, MoreVertical } from "lucide-react";
import { useChat } from "@/hooks/use-chat";

export default function Chat() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/chat/:id");
  const conversationId = match ? parseInt(params.id) : 0;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    messagesLoading, 
    sendMessage, 
    isTyping 
  } = useChat(conversationId);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Function to handle sending a message
  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="flex-1 overflow-hidden">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <button 
              onClick={() => navigate("/")} 
              className="mr-2"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="font-poppins font-semibold text-dark text-lg">Buddy</h1>
              <p className="text-medium text-sm">Your AI travel assistant</p>
            </div>
            <div className="flex items-center gap-3">
              <button>
                <Mic size={20} />
              </button>
              <button>
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col h-[calc(100%-56px)]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messagesLoading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-medium">Loading conversation...</p>
            </div>
          ) : (
            <>
              {/* Chat Messages */}
              {Array.isArray(messages) && messages.map((message) => (
                <ChatBubble key={message.id} message={message as any} />
              ))}
              
              {/* Show typing indicator when assistant is responding */}
              {isTyping && <TypingIndicator />}
              
              {/* Add suggestion chips if last message is from assistant and mentions hotels */}
              {Array.isArray(messages) && messages.length > 0 && 
                messages[messages.length - 1].role === "assistant" && 
                messages[messages.length - 1].content.includes("hotel") && (
                <HotelSuggestions onSelect={handleSuggestionSelect} />
              )}
              
              {/* This div helps us scroll to the bottom */}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Chat Input */}
        <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
      </div>
    </div>
  );
}
