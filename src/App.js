import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './pages/Home';
import { getToken } from './utils/auth';
import 'antd/dist/reset.css';
// import 'antd/dist/antd.css';


const App = () => {
  const isAuth = !!getToken();

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuth ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuth ? <Signup /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
