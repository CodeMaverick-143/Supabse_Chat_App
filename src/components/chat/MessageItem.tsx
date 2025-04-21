import React from 'react';
import { formatMessageDate } from '../../utils/date';
import { Database } from '../../types/supabase';

type Message = Database['public']['Tables']['messages']['Row'] & {
  profiles?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser }) => {
  const displayName = message.profiles?.username || 
                      message.profiles?.full_name || 
                      message.sender_id.split('-')[0];

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div 
        className={`max-w-[80%] ${
          isCurrentUser 
            ? 'bg-indigo-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
            : 'bg-white text-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg border border-gray-200'
        } shadow-sm px-4 py-2`}
      >
        {!isCurrentUser && (
          <div className="text-xs font-semibold mb-1 text-indigo-600">
            {displayName}
          </div>
        )}
        <p className="text-sm break-words whitespace-pre-wrap">{message.message}</p>
        <div className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>
          {formatMessageDate(message.inserted_at)}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;