import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

type AuthMode = 'login' | 'signup' | 'forgot-password';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const handleForgotPassword = () => {
    setMode('forgot-password');
  };

  const handleBackToLogin = () => {
    setMode('login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-accent/10 p-4">
      <div className="w-full max-w-md">
        {mode === 'login' && (
          <LoginForm 
            onToggleMode={handleToggleMode}
            onForgotPassword={handleForgotPassword}
          />
        )}
        {mode === 'signup' && (
          <SignupForm onToggleMode={handleToggleMode} />
        )}
        {mode === 'forgot-password' && (
          <ForgotPasswordForm onBack={handleBackToLogin} />
        )}
      </div>
    </div>
  );
};

export default Auth;