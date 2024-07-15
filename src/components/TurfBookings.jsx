import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VStack, Box, Heading, Text, Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { db } from '../firebase-config/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ref, get } from 'firebase/database';
import { database } from '../firebase-config/config'; 

export const TurfBookings = () => {
  const { turfId, sport } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [turfDetails, setTurfDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("turfId:", turfId);
    console.log("sport:", sport);

    const fetchTurfAndBookings = async () => {
      setLoading(true);
      try {
        // Test Firebase connection
        const testRef = ref(database, 'test');
try {
  console.log("Attempting to connect to Firebase...");
  const snapshot = await get(testRef);
  console.log("Firebase connection test successful", snapshot.val());
} catch (error) {
  console.error("Firebase connection test failed:", error);
  console.error("Error code:", error.code);
  console.error("Error message:", error.message);
  throw new Error(`Failed to connect to Firebase: ${error.message}`);
}

        // Fetch turf details
        const turfDoc = await getDocs(query(collection(db, sport), where("__name__", "==", turfId)));
        if (!turfDoc.empty) {
          setTurfDetails({ id: turfDoc.docs[0].id, ...turfDoc.docs[0].data() });
        } else {
          console.log("No turf found with id:", turfId);
          setError("Turf not found");
          setLoading(false);
          return;
        }
    
        // Fetch bookings
        const usersRef = ref(database, 'users');
        const bookingsSnapshot = await get(usersRef);
        
        let allBookings = [];
        bookingsSnapshot.forEach((userSnapshot) => {
          const userData = userSnapshot.val();
          if (userData && userData.bookings) {
            Object.entries(userData.bookings).forEach(([bookingId, booking]) => {
              console.log("Checking booking:", booking); // Debug log
              if (booking.turfDetails && 
                  booking.turfDetails.turfId === turfId && 
                  booking.turfDetails.sport === sport) {
                allBookings.push({
                  id: bookingId,
                  ...booking,
                  userId: userSnapshot.key
                });
              }
            });
          }
        });
    
        console.log("Filtered bookings:", allBookings); // Debug log
    
        if (allBookings.length === 0) {
          setError("No bookings found for this turf");
        } else {
          setBookings(allBookings);
          setError("");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        console.error("Error details:", error.message, error.stack);
        if (error.code === 'PERMISSION_DENIED') {
          setError("Permission denied. Please check your database rules.");
        } else if (error.code === 'NETWORK_ERROR') {
          setError("Network error. Please check your internet connection.");
        } else {
          setError(`Error fetching bookings: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (turfId && sport) {
      fetchTurfAndBookings();
    }
  }, [turfId, sport]);

  return (
    <VStack spacing={4} align="stretch" p={5}>
      <Button onClick={() => navigate('/admin-dashboard')}>Back to Dashboard</Button>
      <Heading>{turfDetails ? `Bookings for ${turfDetails.name}` : 'Loading...'}</Heading>
      {loading ? (
        <Text>Loading bookings...</Text>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : bookings.length > 0 ? (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>User Email</Th>
              <Th>Date</Th>
              <Th>Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((booking, index) => (
              <Tr key={index}>
                <Td>{booking.userEmail}</Td>
                <Td>{booking.bookingDate}</Td>
                <Td>{booking.time}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text>No bookings found for this turf.</Text>
      )}
    </VStack>
  );
};