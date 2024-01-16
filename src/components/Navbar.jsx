import React from "react";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await axios.post("logout");
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
    }
    reactLocalStorage.clear();
    axios.defaults.headers.common.Authorization = ``;
    // Redirect the user to the login page
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-left" onClick={() => navigate("/home")}>
          <a href="#" className="navbar-logo">
            <span className="navbar-logo-icon">.</span>
            <span className="navbar-logo-text">My EMS</span>
          </a>
        </div>
        <div className="navbar-right">
          <li className="navbar-menu-item">
            <a href="#" className="navbar-menu-link">
              Timetable
            </a>
          </li>
          <li className="navbar-menu-item">
            <a href="#" className="navbar-menu-link">
              Attendance
            </a>
          </li>
          <li className="navbar-menu-item">
            <a href="#" className="navbar-menu-link">
              Exam Results
            </a>
          </li>
          <li className="navbar-menu-item">
            <a href="#" className="navbar-menu-link">
              EMSCard
            </a>
          </li>
          <li className="navbar-menu-item">
            <a href="#" className="navbar-menu-link" onClick={handleLogout}>
              Logout
            </a>
          </li>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
