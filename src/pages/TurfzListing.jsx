import React, { useState } from "react";
import "../style/turf.css";
import { TurfNav } from "../components/TurfNav";
import { Turfdata } from "../components/Turfdata";
import { Footer } from "../components/Footer";

export const TurfzListing = () => {
  const [turf, setTurf] = useState("football");
  const [selectedDistrict, setSelectedDistrict] = useState("Ernakulam"); // Default district

  return (
    <div id="mainContainer">
      <TurfNav 
        setTurf={setTurf} 
        setSelectedDistrict={setSelectedDistrict}
      />
      {/* <MapContainer/> */}
      <Turfdata 
        turf={turf} 
        selectedDistrict={selectedDistrict}
      />
      <Footer />
    </div>
  );
};