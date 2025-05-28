// src/components/Payment/Donate.jsx
import React from "react";
import { Button } from "react-bootstrap";

const Donate = () => {
  // Your working UPI link with parameters
  const upiLink = "upi://pay?pa=7058370270b@oksbi&pn=Vedant&am=10";

  return (
    <div className="p-4 text-center">
      <h4>Support This Project</h4>
      <Button 
        variant="success" 
        as="a" 
        href={upiLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-2"
      >
        Donate ₹10 via UPI
      </Button>
      <p className="text-muted small">
        Will open UPI apps like PhonePe/GPay/BHIM
      </p>
    </div>
  );
};

export default Donate;