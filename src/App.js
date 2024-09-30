import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './Navbar';
import Dashboard from '../src/component/Dashboard';
import CreateWorkout from '../src/component/CreateWorkout';
import CreateExercise from '../src/component/CreateExercise';
import Login from './Login';
import Signup from './Signup';
import './global.css';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the required elements
Chart.register(ArcElement, Tooltip, Legend);

const App = () => (
  <Router>
    <NavigationBar />
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/exercise" element={<CreateExercise />} />
      <Route path='/workout' element={<CreateWorkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </Router>
);

export default App;
