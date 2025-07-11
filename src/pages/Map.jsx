import React, { useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const center = {
  lat: 41.7151,
  lng: 44.8271,
};

export default function Map() {
  const [position, setPosition] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDDawXe-hmm2wBIG3FH995p7BoNF3uR2j4",
  });

  const navigate = useNavigate(); 

  const handleClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setPosition({ lat, lng });
    setShowAlert(false);
  };

  const handleChooseLocation = () => {
    if (!position?.lat || !position?.lng) {
      setShowAlert(true);
    } else {
      localStorage.setItem("locationLat", position.lat);
      localStorage.setItem("locationLng", position.lng);
      localStorage.setItem("locationChosen", "true");

      navigate("/payment");
    }
  };

  return isLoaded ? (
    <>
    <div className="ptpbb"></div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={handleClick}
      >
        {position && <Marker position={position} />}
      </GoogleMap>

      {position && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {/* <p><strong>Latitude:</strong> {position.lat}</p>
          <p><strong>Longitude:</strong> {position.lng}</p> */}

      <div style={{ marginTop: "20px", textAlign: "center",}}>
         <button onClick={handleChooseLocation} className="locationButton">Choose Location</button>
       

        {showAlert && (
          <div className="alert" style={{ color: "red", marginTop: "10px" }}>
            You should choose a location first!
          </div>
        )}
      </div>
        </div>
      )}
          <div className="ptpb"></div>
    </>
  ) : (
    <p>Loading Map...</p>
  );

}
