import React, { useState } from "react";
import Navbar from "../components/Navbar";

const ConfirmLogout = () => {
  return (
    <>
      <Navbar />
      <div className="Flex--center" style={{ height: 'calc(100vh - 95px)' }}>
        <div className="Text-fontSize--24 Text-color--gray-600">
          Logout Confirmed
        </div>
      </div>


    </>
  );
};

export default ConfirmLogout;
