import {useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import Register from './pages/Register';

function App() {
    useEffect(() => {
        axios.defaults.baseURL = `http://localhost:8000`
        axios.defaults.timeout = 15000
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={<Register/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
