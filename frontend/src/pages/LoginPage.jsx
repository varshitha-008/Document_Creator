import React, { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, Heading, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://document-creator.onrender.com/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);

      // Success toast
      toast({
        title: 'Login successful!',
        description: "You've successfully logged in.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      // Error toast
      toast({
        title: 'Login failed.',
        description: error.response?.data?.message || 'An error occurred. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p="4" m="auto" >
      <Heading>Login</Heading>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </FormControl>
      <Button mt="4" colorScheme="blue" onClick={handleLogin}>Login</Button>
    </Box>
  );
};

export default LoginPage;
