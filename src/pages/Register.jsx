import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WebcamCapture from "../components/WebcamCapture";


const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    name:"",
    email: "",
    password: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("image", imageFile);

      // Make a POST request to your registration endpoint

      const response = await axios.post("register", formData);
      console.log(response.data.message);

      alert("Registration successful");

      // Redirect to /
      navigate("/");
    } catch (error) {
      // Handle errors, you might want to show an error message to the user
      console.log(error);
      console.log(error.response.data.message);
      if (error.response.data.message) {
        alert(error.response.data.message);
      }
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
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <WebcamCapture
            onCapture={(file)=>setImageFile(file)}
            onCancel={()=>setImageFile(null)}
        />
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
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
        <button type="submit" disabled={!imageFile}>Register</button>
      </form>
      <div>Already have an account? <a href="/">Login</a> now !</div>
    </div>
  );
};

export default RegisterPage;
