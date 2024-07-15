import React, { useState } from 'react';
import { Input, Button, Alert, Text } from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '../context/Authcontext';
import loginBg from "../images/loginBg.png";

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useUserAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      if (email.endsWith('@admin.com')) {
        navigate('/admin-dashboard');
      } else {
        setError('Not authorized as admin');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div id='loginContainer'>
      <div id='loginBg'>
        <img src={loginBg} alt="" />
      </div>
      <div id='loginform'>
        <h1 id='headingLogin'>ADMIN LOGIN</h1>
        {error && <Alert status='error'>{error}</Alert>}
        <form onSubmit={handleAdminLogin}>
          <div>
            <p id='username'>EMAIL</p>
            <Input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              border="2px solid black"
            />
          </div>
          <div>
            <p id='password'>PASSWORD</p>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              border="2px solid black"
            />
          </div>
          <Button id='loginFormBtn' type="submit">Login as Admin</Button>
        </form>
        <Text mt={2}>Need an admin account? <Link to="/admin-signup">Admin Signup</Link></Text>
        <Text mt={4}>Not an admin? <Link to="/login">Customer Login</Link></Text>
      </div>
    </div>
  );
};