import {useState, useEffect} from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import qs from 'qs';

const LoginPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

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
      formData.append("username", userData.username);
      formData.append("password", userData.password);

      // Make a POST request to login endpoint
      const response = await axios.post("login", formData);
      console.log(response.data.message);

      reactLocalStorage.set("token", response.data.token);

      // Redirect to /home
      navigate("/home");
    } catch (error) {
      // Handle errors, you might want to show an error message to the user
      console.log(error);
      console.log(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
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
        <button type="submit">Login</button>
      </form>
      <div>
        Don't have an account? <a href="/register">Register</a> now !
      </div>
    </div>
  );
};

export default LoginPage;
