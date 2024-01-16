import {useState, useEffect} from 'react'
import Navbar from "../components/Navbar";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";

const HomePage = () => {
    useEffect(() => {
        if (!reactLocalStorage.get("token")) {
            window.location.href = "/";
        }
        axios.defaults.headers.common.Authorization = `Token ${reactLocalStorage.get("token")}`;
    }, []);

  return (
    <div className="Home">
      <Navbar />
      <h1>Educational Management System</h1>
      <div className="content">
        <main className="main-section">
          <h2>Welcome to the Educational Management System</h2>
          <p>
            Here you can manage courses, students, and faculty with ease. Stay
            tuned for more features!
          </p>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
