import React from 'react'
import {Route,Routes} from "react-router-dom"
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { Signup } from '../pages/Signup'
import { UserAuthContextProvider} from '../context/Authcontext'
import { TurfzListing } from '../pages/TurfzListing'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { Payment } from '../pages/Payment'
import { Bookings } from '../pages/Bookings'
import { AdminLogin } from '../components/AdminLogin';
import { AdminProtectedRoute } from '../components/AdminProtectedRoute';
import { AdminDashboard } from '../components/AdminDashboard';
import { AdminSignup } from '../components/AdminSignup'
import { TurfRegistration } from '../components/TurfRegistration';
import { TurfBookings } from '../components/TurfBookings';

export const AllRoutes = () => {
  return (
    <UserAuthContextProvider>
    <Routes>
       <Route path='/' element={<Home/>}/>
       <Route path="/login" element={<Login/>}/>
       <Route path='/signup' element={<Signup/>}/>
       <Route path="/turf" element={<ProtectedRoute>
            <TurfzListing/>
       </ProtectedRoute>}/>
       <Route path="/admin-login" element={<AdminLogin />} />
       <Route path="/admin-login" element={<AdminLogin />} />
       <Route path="/admin-dashboard" element={
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
  } 
/>
       <Route path="/admin-signup" element={<AdminSignup />} />
       <Route path="/payment" element={<Payment/>}/>
       <Route path="/booking" element={<Bookings/>}/>
       <Route path="/turf-registration" element={
    <AdminProtectedRoute>
      <TurfRegistration />
    </AdminProtectedRoute>
  } 
/>
<Route 
  path="/turf-bookings/:sport/:turfId" 
  element={
    <AdminProtectedRoute>
      <TurfBookings />
    </AdminProtectedRoute>
  } 
/>
    </Routes>
    </UserAuthContextProvider>
  )
}
