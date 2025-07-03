import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate ,useLocation} from "react-router-dom";
import Welcome from './components/Welcome'
import Login from './components/login'
import Signup from './components/Signup'
import Home from './components/Home'    
import Sell from './components/Sell'  
import Buy from './components/Buy'
import Items from './components/Items'
import Cart from './components/Cart'
import History from './components/History'
import Deliver from './components/Deliver'
import Chatbot from './components/Chatbot'


function App() {

  const ChatbotWrapper = () => {
    const location = useLocation();
    const excludedPaths = ['/', '/login', '/signup'];
    
    if (excludedPaths.includes(location.pathname)) {
      return null;
    }
    
    return <Chatbot />;
  };

  return (
      <>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path ="/signup" element={<Signup />} />
          <Route path ="/home" element={<Home />} />
          <Route path ="/sell" element={<Sell />} />
          <Route path ="/buy" element={<Buy />} />
          <Route path = "/items/:id" element={<Items />} />
          <Route path = "/cart" element={<Cart />} />
          <Route path = "/history" element = {<History/>} />
          <Route path = "/deliver" element = {<Deliver/>} />
        </Routes>
        <ChatbotWrapper />

      </Router>

    </>
  )
}

export default App
