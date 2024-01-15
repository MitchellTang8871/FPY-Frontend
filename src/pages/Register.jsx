import React, { useState } from 'react';
import axios from 'axios';
import {reactLocalStorage} from "reactjs-localstorage";

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
  });

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
      const formData = new FormData();
      formData.append('username', userData.username);
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('password', userData.password);

      // Make a POST request to your registration endpoint

      const response = await axios.post('register', formData);
      console.log(response.data.message);

      axios.post('login', formData);
      reactLocalStorage.set("token", response.data.token);

      // Clear the form fields after successful registration
      setUserData({
        username: '',
        name:'',
        email: '',
        password: '',
      });

    } catch (error) {
      // Handle errors, you might want to show an error message to the user
      console.log(error)
      console.log(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;