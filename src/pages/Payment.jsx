import React, { useEffect, useState } from 'react'
import "../style/payment.css"
import { IoMdArrowRoundBack } from "react-icons/io"
import { Link } from 'react-router-dom'
import { useUserAuth } from '../context/Authcontext'
import { ref, onValue } from "firebase/database";
import { database } from '../firebase-config/config'
import { Checkbox, Button, Text } from '@chakra-ui/react'
import { PopoverProfile } from '../components/Popover'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure
} from '@chakra-ui/react'
import qrImage from '../images/chatbot.jpg'; // Adjust the path as necessary

export const Payment = () => {
  const { user } = useUserAuth();
  const [name, setName] = useState("")
  const [time, setTime] = useState("")
  const [showQR, setShowQR] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const getUserData = (uid) => {
    const userRef = ref(database, "users/" + uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data === null) {
        return "No DATA Found"
      } else {
        const bookingName = data.data

        setName(bookingName.booking.name)
        setTime(bookingName.time)
      }

    })
  }
  useEffect(() => {
    if (user) {
      getUserData(user.uid)
    }
  }, [user, name])

  const handleQRCodeDisplay = () => {
    setShowQR(true);
    setCountdown(30);
  }

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setShowQR(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  )

  const OverlayTwo = () => (
    <ModalOverlay
      bg='none'
      backdropFilter='auto'
      backdropInvert='80%'
      backdropBlur='2px'
    />
  )

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [overlay, setOverlay] = useState(<OverlayOne />)
  return (
    <div id='paymentContainer'>
      <div id="paymentNav">
        <Link to={"/turf"}>
          <IoMdArrowRoundBack fontWeight={"bold"} fontSize="30px" />
        </Link>
        <p id='BookedTurfName'>{name}</p>
        <PopoverProfile email={user.email} />
      </div>
      <div id='paymentContainerBox'>
        <div id='paymentMode'>
          <Text fontWeight={"bold"} fontSize="25px">Pay Now</Text>
          <Checkbox onChange={handleQRCodeDisplay}>Pay with QR</Checkbox>
          <Button
            onClick={() => {
              handleQRCodeDisplay();
              setOverlay(<OverlayTwo />)
              onOpen()
            }}
            colorScheme="red"
          >
            Select
          </Button>
          <Modal isCentered isOpen={isOpen} onClose={onClose}>
            {overlay}
            <ModalContent>
              <ModalHeader>Order Booked</ModalHeader>
              <ModalBody>
                <Text>Thanks for booking {name}</Text>
                <Text>Time : {time}</Text>
              </ModalBody>
              <ModalFooter>
                <Link to="/turf">
                  <Button onClick={onClose}>Close</Button>
                </Link>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {showQR && (
            <div id='qrCodeContainer'>
              <img src={qrImage} alt="QR Code" />
              <Text>Time remaining: {countdown} seconds</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}