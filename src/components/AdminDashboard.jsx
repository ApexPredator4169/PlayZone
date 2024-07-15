import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/Authcontext';
import { Button, Text, VStack, Box, Heading, SimpleGrid } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase-config/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const AdminDashboard = () => {
  const { user, logout } = useUserAuth();
  const navigate = useNavigate();
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTurfs();
  }, [user]);

  const fetchTurfs = async () => {
    setLoading(true);
    try {
      const sportTypes = ['football', 'cricket', 'basketball', 'badminton'];
      let allTurfs = [];

      for (let sport of sportTypes) {
        const turfsCollection = collection(db, sport);
        const q = query(turfsCollection, where("ownerEmail", "==", user.email));
        const turfSnapshot = await getDocs(q);
        const sportTurfs = turfSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), sport }));
        allTurfs = [...allTurfs, ...sportTurfs];
      }

      setTurfs(allTurfs);
    } catch (error) {
      console.error('Error fetching turfs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin-login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const handleViewBookings = (turfId, sport) => {
    navigate(`/turf-bookings/${sport}/${turfId}`);
  };

  return (
    <VStack spacing={4} align="stretch" p={5}>
      <Heading>Admin Dashboard</Heading>
      <Text>Welcome, {user.email}</Text>
      
      <Button onClick={() => navigate('/turf-registration')} colorScheme="green">Register New Turf</Button>
      
      <Box>
        <Heading size="md" mb={4}>Your Registered Turfs</Heading>
        {loading ? (
          <Text>Loading turfs...</Text>
        ) : turfs.length > 0 ? (
          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            {turfs.map((turf) => (
              <Box key={turf.id} p={3} shadow="md" borderWidth="1px" borderRadius="md">
                <Heading fontSize="xl">{turf.name}</Heading>
                <Text mt={2}>{turf.address}, {turf.district}</Text>
                <Text>Sport: {turf.sport}</Text>
                <Button mt={2} onClick={() => handleViewBookings(turf.id, turf.sport)} colorScheme="blue">
                  View Bookings
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Text>You haven't registered any turfs yet.</Text>
        )}
      </Box>
      
      <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
    </VStack>
  );
};