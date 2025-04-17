import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';
import GoogleLoginButton from '../components/GoogleLoginButton';
import UsernamePasswordLogin from '../components/UsernamePasswordLogin';

function LoginPage() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src="/legacy-logo.svg"
          alt="Legacy Logo"
          sx={{
            width: '200px',
            mb: 4,
          }}
        />
        <Typography component="h1" variant="h5" sx={{ mb: 4 }}>
          Legacy Admin Login
        </Typography>
        
        {/* Username/Password Login Section */}
        <UsernamePasswordLogin />

        {/* Divider with text */}
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', my: 3 }}>
          <Divider sx={{ flexGrow: 1 }} />
          <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
            OR
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>

        {/* Google Login Section */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <GoogleLoginButton />
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
