import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import WebcamCapture from "../components/WebcamCapture";
import qs from 'qs';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: "test",
    password: "test",
  });
  const [otp, setOtp] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [captureFace, setCaptureFace] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [otpVerification, setOtpVerification] = useState(false);
  const [cooldown, setCooldown] = useState(false);


  const checkToken = async () => {
    if (reactLocalStorage.get("token")) {
      try {
        const payload = { token: reactLocalStorage.get("token") };
        const response = await axios.post("checkToken", qs.stringify(payload));
        if (response.status === 200) {
          // Token is valid
          axios.defaults.headers.common.Authorization = `Token ${reactLocalStorage.get("token")}`;
          navigate("/home");
        }
      } catch (error) {
        if (error.response.status === 460) {
          // Token is invalid
          reactLocalStorage.clear();
        }
      }
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    const form = document.querySelector('form');
    if (form) {
      setFormIsValid(form.checkValidity());
    }
  }, [userData.username, userData.password]);

  useEffect(() => {
    // Check if imageFile is not null and call handleSubmit
    if (imageFile) {
      handleSubmit();
    }
  }, [imageFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    // Check if the event object is provided
    if (e) {
      e.preventDefault();
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("password", userData.password);
      formData.append("image", imageFile);
      formData.append("otp", otp);

      // Make a POST request to login endpoint
      const response = await axios.post("login", formData, {timeout:30000});
      console.log(response.data.message);

      reactLocalStorage.set("token", response.data.token);

      // Redirect to /home
      navigate("/home");
    } catch (error) {
      // Handle errors, you might want to show an error message to the user
      console.log(error);
      console.log(error.response.data.message);
      if (error.response.data.message) {
        alert(error.response.data.message);
      }
      if (error.response.status === 406) {
        //otp verification
        setOtpVerification(true);
      } else if (error.response.status === 401 || error.response.status === 500) {
        setImageFile(null);
        setOtpVerification(false);
        setOtp("");
        setCaptureFace(false);
      } else {
        setImageFile(null);
        setOtpVerification(false);
        setOtp("");
      }
    } finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };

  const resendOtp = async () => {
    try {
      setLoading(true);
      const payload = {
        username: userData.username,
        password: userData.password,
        action: "Login",
      };
      const response = await axios.post("resendOtp", qs.stringify(payload));
      console.log(response.data.message);

      // Enable cooldown after successful request
      setCooldown(true);
      setTimeout(() => {
        setCooldown(false);
      }, 30000);  // Set the cooldown duration in milliseconds (30 seconds)

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <h2>Login</h2>
      {!captureFace ? (
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="username"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button disabled={loading || !formIsValid} onClick={()=>setCaptureFace(true)}>Login</button>
          </form>
          <div>
            Don't have an account? <a href="/register">Register</a> now !
          </div>
        </div>
        ) : (
          !otpVerification ? (
            <div>
              <WebcamCapture
                  key={reloadKey}
                  live={false}
                  dev={true} //development purpose
                  onCapture={(file)=>setImageFile(file)}
                  onCancel={()=>setImageFile(null)}
                  onReload={()=>setReloadKey(reloadKey+1)}
                  back={true}
                  onBack={()=>{setCaptureFace(false); setImageFile(null)}}
              />
            </div>
          )
          : (
            <div>
              <button disabled={loading} onClick={()=>{setImageFile(null); setOtpVerification(false); setOtp("");}}>Back</button>
              <div>
                <label htmlFor="otp">Enter OTP:</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button disabled={loading || cooldown} onClick={() => resendOtp()}>
                  Resend
                </button>
              </div>
              <div>
                <button disabled={loading} onClick={() => handleSubmit()}>
                  Verify OTP
                </button>
              </div>
          </div>
          )
        )
      }
    </div>
  );
};

export default LoginPage;