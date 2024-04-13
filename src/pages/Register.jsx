import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WebcamCapture from "../components/WebcamCapture";
import { Button, Input } from 'reactstrap';


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
  const [reloadKey, setReloadKey] = useState(0);
  const [image, setImage] = useState(null);

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

      const response = await axios.post("register", formData, {timeout:30000});
      console.log(response.data.message);

      alert(response.data.message);

      // Redirect to /
      navigate("/");
    } catch (error) {
      // Handle errors, you might want to show an error message to the user
      console.log(error);
      console.log(error.response.data.message);
      if (error.response.data.message) {
        if (error.response.data.encodedImage) {
          setImage(error.response.data.encodedImage);
        }
        alert(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{marginBottom:50}}>
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}>
        <WebcamCapture
            key={reloadKey}
            live={false}
            dev={false} //development purpose
            onCapture={(file)=>setImageFile(file)}
            onCancel={()=>{setImageFile(null);setImage(null)}}
            onReload={()=>setReloadKey(reloadKey+1)}
            image={image}
        />
        <div style={{ display: "flex", flexDirection: "row",  gap: 10 }}>
          <label htmlFor="username">Username:</label>
          <Input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row",  gap: 10 }}>
          <label htmlFor="name">Name:</label>
          <Input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row",  gap: 10 }}>
          <label htmlFor="email">Email:</label>
          <Input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row",  gap: 10 }}>
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
        <Button type="submit" disabled={!imageFile}>Register</Button>
      </form>
      <div>Already have an account? <a href="/">Login</a> now !</div>
    </div>
  );
};

export default RegisterPage;