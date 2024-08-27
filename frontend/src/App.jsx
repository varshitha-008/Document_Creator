import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import LoginPage from './pages/LoginPage';
import Signup from './pages/SignupPage';
import HomePage from './pages/HomePage';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <ChakraProvider>
      <Router>
         <Navbar />
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
