import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';

  const handleDebugLogin = () => {
    // Create a mock token for debug mode
    const debugToken = 'debug_token_' + Date.now();
    login(debugToken);
    navigate('/'); // Navigate to dashboard after debug login
  };

  if (isDebugMode) {
    return (
      <Button
        variant="contained"
        onClick={handleDebugLogin}
        sx={{
          backgroundColor: '#538771',
          '&:hover': {
            backgroundColor: '#3c6f59',
          },
          py: 1.5
        }}
      >
        Debug Login (Bypass Google)
      </Button>
    );
  }

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          // Get user info from Google
          const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${credentialResponse.access_token}` },
          }).then(res => res.json());

          // Here you would typically send the token to your backend
          // For now, we'll just store the access token
          login(credentialResponse.access_token);
          navigate('/'); // Navigate to dashboard after successful Google login
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }}
      onError={() => {
        console.error('Login Failed');
      }}
      useOneTap
      theme="filled"
      size="large"
      width="240"
    />
  );
};

export default GoogleLoginButton; 