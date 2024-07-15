import React, { useState, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { useUserAuth } from "../context/Authcontext";
import { ref, onValue, remove, get } from "firebase/database";
import { database } from "../firebase-config/config";
import { Button, Text } from "@chakra-ui/react";
import { BookingSkeleton } from "../components/BookingSkeleton";

export const Bookings = () => {
  const { user } = useUserAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const getUserData = (uid) => {
    setLoading(true);
    const userBookingsRef = ref(database, `users/${uid}/bookings`);
    onValue(
      userBookingsRef,
      (snapshot) => {
        try {
          const data = snapshot.val();
          console.log("Raw data from Firebase:", data);
          if (data === null) {
            setError("No Bookings found");
            setBookings([]);
          } else {
            const bookingsArray = Object.entries(data).map(([id, booking]) => ({
              id,
              ...booking
            }));
  
            if (bookingsArray.length === 0) {
              setError("No bookings found");
            } else {
              setBookings(bookingsArray);
              setError("");
            }
          }
        } catch (err) {
          console.error("Error processing bookings:", err);
          setError("Error loading bookings");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Database read failed:", error);
        setError("Failed to load bookings");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (user) {
      getUserData(user.uid);
    }
  }, [user]);

  const handleCancel = async (bookingId) => {
    setLoading(true);
    const bookingRef = ref(database, `users/${user.uid}/bookings/${bookingId}`);
    try {
      // First, get the booking data
      const snapshot = await get(bookingRef);
      const bookingData = snapshot.val();
      
      console.log("Booking data before removal:", bookingData);
      
      if (!bookingData) {
        throw new Error("Booking not found");
      }
      
      // Then, remove the booking
      await remove(bookingRef);
      
      console.log("Booking removed successfully");
      
      // Update local state
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId)
      );
      
      alert("Successfully Canceled Booking");
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Failed to cancel booking: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const BookingDiv = () => {
    if (bookings.length === 0) {
      return (
        <div id="errorOrder">
          <Text
            fontSize={"50px"}
            textAlign="center"
            marginTop={"50px"}
            fontWeight="bold"
          >
            {error || "No Bookings Found"}
          </Text>
        </div>
      );
    } else {
      return (
        <div>
          <p id="BookedTurfName">Current Bookings</p>
          {bookings.map((booking) => {
            console.log("Rendering booking:", booking);  // Add this line for debugging
            return (
              <div key={booking.id} id="bookingsDetails">
                <p>{booking.turfDetails?.name || 'Unknown Turf'}</p>
                <div id="bookingImageBox">
                  {booking.turfDetails?.image && (
                    <img src={booking.turfDetails.image} alt="Turf" />
                  )}
                </div>
                <p>Address: {booking.turfDetails?.address || 'Address not available'}</p>
                <p>Time: {booking.time || 'Time not specified'}</p>
                <p>Date: {booking.bookingDate || 'Date not specified'}</p>
                <Button
                  colorScheme={"red"}
                  onClick={() => handleCancel(booking.id)}
                  isDisabled={loading}
                >
                  Cancel
                </Button>
              </div>
            );
          })}
        </div>
      );
    }
  };

  return (
    <div>
      <div id="paymentNav">
        <Link to={"/turf"}>
          <IoMdArrowRoundBack fontWeight={"bold"} fontSize="30px" />
        </Link>
        <Text color={"red"} fontSize="30px" fontWeight={"bold"}>
          Bookings
        </Text>
      </div>
      {loading ? <BookingSkeleton /> : <BookingDiv />}
    </div>
  );
};