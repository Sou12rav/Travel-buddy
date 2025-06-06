import { useState, useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import ChatBubble, { TypingIndicator } from "@/components/chat-bubble";
import ChatInput from "@/components/chat-input";
import ChatSuggestions from "@/components/chat-suggestions";
import { HotelSuggestions } from "@/components/suggestion-chips";
import { ArrowLeft, MoreVertical, HelpCircle, Zap } from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function Chat() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/chat/:id");
  const conversationId = match ? parseInt(params.id) : 0;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
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
    setShowSuggestions(false);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    sendMessage(suggestion);
    setShowSuggestions(false);
  };

  // Check if conversation is empty
  const isEmptyConversation = !messages || messages.length === 0;

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
              <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <HelpCircle size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Chat Help & Features</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          What I can help with:
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Travel planning and destinations</li>
                          <li>• Weather and travel alerts</li>
                          <li>• Cultural customs and local food</li>
                          <li>• Transportation options</li>
                          <li>• GitHub and VSCode development</li>
                          <li>• API integration guidance</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <div className="text-sm text-gray-600">
                      <p>Tip: Use the suggestion chips below for quick access to common queries!</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                <MoreVertical size={20} />
              </Button>
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
              {/* Show suggestions for empty conversation */}
              {isEmptyConversation && showSuggestions && (
                <ChatSuggestions 
                  onSelectSuggestion={handleSuggestionSelect}
                  isVisible={true}
                />
              )}
              
              {/* Chat Messages */}
              {Array.isArray(messages) && messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              
              {/* Show typing indicator when assistant is responding */}
              {isTyping && <TypingIndicator />}
              
              {/* Add suggestion chips if last message is from assistant and mentions hotels */}
              {Array.isArray(messages) && messages.length > 0 && 
                messages[messages.length - 1].role === "assistant" && 
                messages[messages.length - 1].content.includes("hotel") && (
                <HotelSuggestions onSelect={handleSuggestionSelect} />
              )}
              
              {/* Show suggestions toggle for existing conversations */}
              {!isEmptyConversation && showSuggestions && (
                <ChatSuggestions 
                  onSelectSuggestion={handleSuggestionSelect}
                  isVisible={true}
                />
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
