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
import EMSCardPage from './pages/EMSCard';
import AdminPage from './pages/Admin';
import LoginPage2 from './pages/Login2';

function App() {
    useEffect(() => {
        // axios.defaults.baseURL = `https://ilwuvjed3x.ap.loclx.io`
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
                <Route path="/emscard" element={<EMSCardPage/>}/>
                <Route path="/admin" element={<AdminPage/>}/>
                <Route path="/login2" element={<LoginPage2/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
