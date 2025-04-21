import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { MessageCircle } from 'lucide-react';

interface AuthScreenProps {
  onSuccess?: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md mb-8 text-center">
        <div className="inline-flex items-center justify-center mb-4">
          <MessageCircle className="w-10 h-10 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Supabase Chat</h1>
        <p className="text-gray-600">Connect with others in real-time</p>
      </div>
      
      {isLogin ? (
        <LoginForm 
          onSuccess={onSuccess} 
          onSwitchToSignUp={() => setIsLogin(false)} 
        />
      ) : (
        <SignUpForm 
          onSuccess={onSuccess} 
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
};

export default AuthScreen;