import React, { useState } from 'react';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

export const AuthNavigator: React.FC = () => {
  const [currentAuthScreen, setCurrentAuthScreen] = useState<'login' | 'register'>('login');

  return (
    <div className="w-full h-full flex flex-1 flex-col overflow-hidden">
      {currentAuthScreen === 'login' ? (
        <LoginScreen onNavigateToRegister={() => setCurrentAuthScreen('register')} />
      ) : (
        <RegisterScreen onNavigateToLogin={() => setCurrentAuthScreen('login')} />
      )}
    </div>
  );
};
