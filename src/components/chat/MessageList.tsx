import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { Database } from '../../types/supabase';

type Message = Database['public']['Tables']['messages']['Row'] & {
  profiles?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  
  messages.forEach(message => {
    const date = new Date(message.inserted_at).toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  // Generate date dividers and messages
  const renderMessageGroups = () => {
    return Object.entries(groupedMessages).map(([date, messagesForDate]) => (
      <div key={date}>
        <div className="flex items-center justify-center my-4">
          <div className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600">
            {date === new Date().toLocaleDateString() ? 'Today' : date}
          </div>
        </div>
        {messagesForDate.map(message => (
          <MessageItem
            key={message.id}
            message={message}
            isCurrentUser={message.sender_id === currentUserId}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>No messages yet. Start a conversation!</p>
        </div>
      ) : (
        renderMessageGroups()
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;