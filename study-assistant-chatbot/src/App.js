import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/auth/signup page/signup';
import Login from './components/auth/login page/login';
import Chat from "./components/chatbot page/chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
