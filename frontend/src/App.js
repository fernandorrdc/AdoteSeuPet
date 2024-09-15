import { BrowserRouter as Router,Routes, Route } from "react-router-dom"
import React from 'react'

/* Components */
import Navbar from "./components/Layout/Navbar"
import Footer from "./components/Layout/Footer"
import Message from "./components/Layout/Message"


/*  pages */
import Login from './components/pags/Auth/login'
import Register from './components/pags/Auth/Register'
import Home from './components/pags/Home'
import Container from "./components/Layout/Container"
import Profile from "./components/pags/User/Profile"

/* context */
import { UserProvider } from "./context/UserContext"

function App() {

  return (
    <Router>
      <UserProvider>
      <Navbar />
      <Message />
      <Container>
      <Routes>

        <Route path="/login" element={<Login/>} >
        </Route>

        <Route path="/register" element={<Register/>}>
        </Route>

        <Route path="/user/profile" element={<Profile/>}>
        </Route>

        <Route path="/" element={<Home/>}>
        </Route>

      </Routes>
      </Container>
      <Footer />
      </UserProvider>
    </Router>
  )
}

export default App
