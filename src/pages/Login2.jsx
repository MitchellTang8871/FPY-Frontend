import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import { Button, Input } from 'reactstrap';
import WebcamCapture from "../components/WebcamCapture";
import qs from 'qs';

//ASC

const LoginPage2 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [formIsValid, setFormIsValid] = useState(false);
  const [message, setMessage] = useState("");


  const checkToken = async () => {
    if (reactLocalStorage.get("token")) {
      try {
        const payload = { token: reactLocalStorage.get("token") };
        const response = await axios.post("checkToken", qs.stringify(payload), {timeout:30000});
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

      // Make a POST request to login endpoint
      const response = await axios.post("login2", formData, {timeout:300000});
      console.log(response.data.message);

      reactLocalStorage.set("token", response.data.token);

      // Redirect to /home
      navigate("/home");
    } catch (error) {
      // Handle errors, you might want to show an error message to the user
      console.log(error);
      console.log(error.response.data.message);
      if (error.response.data.message) {
        // alert(error.response.data.message);
        setMessage(error.response.data.message);
      }
    } finally {
      setLoading(false); // Set loading to false after the request is complete
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
      {message && <p style={{ color: "red" }}>{message}</p>}
      <div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}
          onKeyDown={(e) => e.key === "Enter" && setCaptureFace(true)}>
            <div style={{ display: "flex", flexDirection: "row",  gap: 10 }}>
              <label htmlFor="username">Username:</label>
              <Input
                type="username"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <label htmlFor="password">Password:</label>
              <Input
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button disabled={loading || !formIsValid} onClick={()=>handleSubmit()}>Login</Button>
          </form>
          <div>
            Don't have an account? <a href="/register">Register</a> now !
          </div>
        </div>
    </div>
  );
};

export default LoginPage2;