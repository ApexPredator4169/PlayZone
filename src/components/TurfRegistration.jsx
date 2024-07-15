import React, { useState } from 'react';
import { Button, VStack, Box, Heading, Input, Select, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { db } from '../firebase-config/config';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/Authcontext';

export const TurfRegistration = () => {
    const { user } = useUserAuth();
  const [newTurf, setNewTurf] = useState({
    name: '',
    address: '',
    district: '',
    image: '',
    sport: ''
  });
  const navigate = useNavigate();
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTurf(prev => ({ ...prev, [name]: value }));
  };

  const handleTurfRegistration = async (e) => {
    e.preventDefault();
    try {
      const sportCollection = collection(db, newTurf.sport);
      await addDoc(sportCollection, {
        ...newTurf,
        ownerEmail: user.email
      });
      toast({
        title: "Turf registered successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewTurf({ name: '', address: '', district: '', image: '', sport: '' });
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Error registering turf:', error);
      toast({
        title: "Failed to register turf",
        description: "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="500px" margin="auto" mt={10}>
      <Heading mb={6}>Register New Turf</Heading>
      <form onSubmit={handleTurfRegistration}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Turf Name</FormLabel>
            <Input name="name" value={newTurf.name} onChange={handleInputChange} placeholder="Enter turf name" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Address</FormLabel>
            <Input name="address" value={newTurf.address} onChange={handleInputChange} placeholder="Enter turf address" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>District</FormLabel>
            <Input name="district" value={newTurf.district} onChange={handleInputChange} placeholder="Enter district" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Image Link</FormLabel>
            <Input name="image" value={newTurf.image} onChange={handleInputChange} placeholder="Enter image link" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Sport</FormLabel>
            <Select name="sport" value={newTurf.sport} onChange={handleInputChange} placeholder="Select sport">
              <option value="football">Football</option>
              <option value="cricket">Cricket</option>
              <option value="basketball">Basketball</option>
              <option value="badminton">Badminton</option>
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="green" width="full">Register Turf</Button>
          <Button onClick={() => navigate('/admin-dashboard')} width="full">Back to Dashboard</Button>
        </VStack>
      </form>
    </Box>
  );
};