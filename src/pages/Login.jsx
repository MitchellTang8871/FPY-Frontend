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
  const [imageFile, setImageFile] = useState(null);
  const [captureFace, setCaptureFace] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);


  const checkToken = async () => {
    if (reactLocalStorage.get("token")) {
      try {
        const payload = { token: reactLocalStorage.get("token") };
        const response = await axios.post("checkToken", qs.stringify(payload));
        if (response.status === 200) {
          // Token is valid
          navigate("/home");
        } else {
          // Token is invalid
          alert("Invalid token. Please log in again.");
          reactLocalStorage.clear();
        }
      } catch (error) {
        console.log(error);
        console.log(error.response.data.message);
        reactLocalStorage.clear();
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
      setImageFile(null);
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
            {loading && <p>Loading...</p>} {/* Display loading indicator if loading is true */}
          </form>
          <div>
            Don't have an account? <a href="/register">Register</a> now !
          </div>
        </div>
        ) : (
          <div>
            <button disabled={loading} onClick={()=>setCaptureFace(false)}>Back</button>
            <WebcamCapture
                key={reloadKey}
                live={false}
                onCapture={(file)=>setImageFile(file)}
                onCancel={()=>setImageFile(null)}
                onReload={()=>setReloadKey(reloadKey+1)}
            />
          </div>
        )
      }
    </div>
  );
};

export default LoginPage;
