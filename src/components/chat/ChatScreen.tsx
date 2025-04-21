import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Database } from '../../types/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

type Message = Database['public']['Tables']['messages']['Row'] & {
  profiles?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const { user } = useAuth();

  // Fetch messages on component mount
  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            profiles:sender_id (
              username,
              full_name,
              avatar_url
            )
          `)
          .order('inserted_at', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          setMessages(data as Message[]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages' 
        }, 
        (payload) => {
          // Fetch the inserted message with profile information
          supabase
            .from('messages')
            .select(`
              *,
              profiles:sender_id (
                username,
                full_name,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setMessages(prev => [...prev, data as Message]);
              }
            });
        }
      )
      .subscribe();

    // Track online users (simplified version)
    setUserCount(1); // At least the current user

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [user]);

  const sendMessage = async (messageText: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          message: messageText,
          sender_id: user.id,
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader userCount={userCount} />
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <span className="ml-2 text-indigo-600">Loading messages...</span>
        </div>
      ) : (
        <MessageList messages={messages} currentUserId={user.id} />
      )}
      
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatScreen;