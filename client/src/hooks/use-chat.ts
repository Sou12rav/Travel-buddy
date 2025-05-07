import { useState, useEffect } from "react";
import { useApp } from "../lib/api_context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessagesResponse, ChatMessage } from "../lib/types";

export function useChat(conversationId: number) {
  const { sendChatMessage, getConversationMessages } = useApp();
  const [isTyping, setIsTyping] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch messages for this conversation
  const { 
    data,
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages
  } = useQuery<MessagesResponse>({
    queryKey: [`/api/conversations/${conversationId}/messages`]
  });
  
  // Extract messages array from response
  const messages = data?.messages || [];
  
  // Mutation for sending a message
  const { mutate, isPending } = useMutation({
    mutationFn: async (message: string) => {
      setIsTyping(true);
      return await sendChatMessage(message, conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/conversations/${conversationId}/messages`] });
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
    }
  });
  
  const sendMessage = (message: string) => {
    mutate(message);
  };
  
  return {
    messages,
    messagesLoading,
    messagesError,
    sendMessage,
    isTyping: isTyping || isPending,
    refetchMessages
  };
}
