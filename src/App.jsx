import {useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import RegisterPage from './pages/Register';
import HomePage from './pages/Home';
import LoginPage from './pages/Login'

function App() {
    useEffect(() => {
        axios.defaults.baseURL = `http://localhost:8000`
        axios.defaults.timeout = 15000
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/home" element={<HomePage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
