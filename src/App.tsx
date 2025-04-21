import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './components/auth/AuthScreen';
import ChatScreen from './components/chat/ChatScreen';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Short delay to prevent flash of loading screen
    if (!loading) {
      const timer = setTimeout(() => {
        setInitializing(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (initializing || loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading application...</p>
      </div>
    );
  }

  return user ? <ChatScreen /> : <AuthScreen />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)',
          },
          success: {
            style: {
              borderLeft: '4px solid #10B981',
            },
          },
          error: {
            style: {
              borderLeft: '4px solid #EF4444',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;