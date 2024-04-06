import React, { useState, useEffect } from "react";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Input } from "reactstrap";
import qs from 'qs';

const Navbar = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [otpModal, setOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axios.post("logout", {timeout:30000});
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
    }
    reactLocalStorage.clear();
    axios.defaults.headers.common.Authorization = ``;
    // Redirect the user to the login page
    navigate("/");
  };

  const notAvailable = () => {
    alert("Not Available at the moment");
  }

  const getResults = async () => {
    try {
      setLoading(true);
      const payload = { otp: otp };
      const response = await axios.post("getresults", qs.stringify(payload), {timeout:30000});

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: "application/pdf" });
      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);
      // Open the URL in a new tab
      window.open(url, '_blank');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response.status === 406) {
        alert(error.response.data.message);
      } else if (error.response.status === 460) {
        // Token is invalid
        reactLocalStorage.clear();
      } else {
        alert("Error occurred while generate results.");
        console.error(error);
      }
    }
}

const resendOtp = async () => {
  try {
    console.log("send")
    setLoading(true);
    const payload = {
      action: "Check Exam Result",
    };
    const response = await axios.post("resendOtp", qs.stringify(payload), {timeout:30000});
    console.log(response.data.message);

    // Enable cooldown after successful request
    setCooldown(true);
    setTimeout(() => {
      setCooldown(false);
    }, 30000);  // Set the cooldown duration in milliseconds (30 seconds)

  } catch (error) {
    console.log(error);
  } finally {
    setOtpSent(true);
    setLoading(false);
  }
};

  return (
    <>
      <Modal isOpen={otpModal} toggle={()=>setOtpModal(false)} style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", color:"black"}}>
        <div style={{display:"flex", flexDirection:"column", margin:10, gap:10  }}>
          <div style={{display:"flex", justifyContent:"space-between", gap:10}}>
            <label htmlFor="otp">Enter OTP:</label>
            <Input
              value={otp}
              onChange={(e) => {setOtp(e.target.value)}}
              onKeyDown={(e) => e.key === "Enter" && getResults()}
            />
            <Button disabled={loading || cooldown} onClick={() => resendOtp()}>
              {otpSent ? 'Resend' : 'Send'}
            </Button>
          </div>
          <div style={{textAlign:"center"}}>
            <Button disabled={loading} onClick={() => getResults()}>
              Verify OTP
            </Button>
          </div>
        </div>
      </Modal>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="nav-left" onClick={() => navigate("/home")}>
            <a href="#" className="navbar-logo">
              <span className="navbar-logo-icon">.</span>
              <span className="navbar-logo-text">My EMS</span>
            </a>
          </div>
          <div className="navbar-right">
            {/* <li className="navbar-menu-item">
              <a href="#" className="navbar-menu-link" onClick={()=>notAvailable()}>
                Timetable
              </a>
            </li>
            <li className="navbar-menu-item">
              <a href="#" className="navbar-menu-link" onClick={()=>notAvailable()}>
                Attendance
              </a>
            </li> */}
            <li className="navbar-menu-item">
              <a href="#" className="navbar-menu-link" onClick={()=>setOtpModal(true)}>
                Exam Results
              </a>
            </li>
            <li className="navbar-menu-item">
              <a href="/emscard" className="navbar-menu-link">
                EMSCard
              </a>
            </li>
            <li className="navbar-menu-item">
              <a href="/activitylogs" className="navbar-menu-link">
                Activity Log
              </a>
            </li>
            <li className="navbar-menu-item">
              <a href="#" className="navbar-menu-link" onClick={()=>handleLogout()}>
                Logout
              </a>
            </li>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
