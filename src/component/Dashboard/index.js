// src/App.js
import React from 'react';
import WorkoutStatusChart from "../WorkoutStatusChart";
import ExerciseDistributionContainer from "../ExerciseDistributionContainer";
import '../../App.css'; // Import the CSS file

const App = () => {
  return (
      <div className="dashboard">
          <h1>Fitness Application Dashboard</h1>
          <div className="chart-container">
              <div className="chart">
                  <ExerciseDistributionContainer />
              </div>
              <div className="chart">
                  <WorkoutStatusChart />
              </div>
          </div>
      </div>
  );
};

export default App;
