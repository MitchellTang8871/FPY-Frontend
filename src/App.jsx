import {useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import RegisterPage from './pages/Register';
import HomePage from './pages/Home';
import LoginPage from './pages/Login'
import ActivityLogsPage from './pages/ActivityLogs';

function App() {
    useEffect(() => {
        // axios.defaults.baseURL = `https://dfb0-2001-e68-7dbc-a001-4114-a272-b01b-204c.ngrok-free.app`
        // axios.defaults.baseURL = `xlctan7uc3.loclx.io`
        axios.defaults.baseURL = `http://localhost:8000`
        axios.defaults.timeout = 15000
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/home" element={<HomePage/>}/>
                <Route path="/activitylogs" element={<ActivityLogsPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
