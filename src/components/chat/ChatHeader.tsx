import React from 'react';
import { LogOut, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ChatHeaderProps {
  userCount?: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ userCount = 0 }) => {
  const { signOut, user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Baatchit</h1>
            <div className="ml-3 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full flex items-center">
              <Users className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs font-medium">{userCount}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-sm text-gray-600 mr-4">
              {user?.email}
            </div>
            <button
              onClick={signOut}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
