import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"
//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register';

function App() {
  useEffect(() => {
    axios.defaults.baseURL = `http://localhost:8000`
    axios.defaults.timeout = 15000
}, []);
  return (
    <Routes>
      <Route path="/" element={<Register/>} />
      <Route index element={<Register />} />
    </Routes>
  )
}

export default App