import React, { useState } from 'react';
import { Input, Button, Alert, Text, VStack } from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '../context/Authcontext';
import loginBg from "../images/loginBg.png";

export const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useUserAuth();
  const navigate = useNavigate();

  const handleAdminSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.endsWith('@admin.com')) {
      setError('Admin email must end with @admin.com');
      return;
    }
    try {
      await signup(email, password);
      // Here you would typically set a custom claim or add the user to an admin collection
      // For this example, we're just using the email domain
      alert('Admin account created successfully');
      navigate('/admin-login');
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
        <h1 id='headingLogin'>ADMIN SIGNUP</h1>
        {error && <Alert status='error'>{error}</Alert>}
        <form onSubmit={handleAdminSignup}>
          <VStack spacing={4}>
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
            <Button id='loginFormBtn' type="submit">Sign Up as Admin</Button>
          </VStack>
        </form>
        <Text mt={4}>Already have an admin account? <Link to="/admin-login">Admin Login</Link></Text>
        <Text mt={2}>Not an admin? <Link to="/login">Customer Login</Link></Text>
      </div>
    </div>
  );
};