import React from 'react';
import { Pie } from 'react-chartjs-2';

const ExerciseDistributionChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.muscleGroup),
    datasets: [{
      data: data.map(item => item.count),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
    }]
  };

  return (
    <div>
      <h2>Exercise Distribution by Muscle Group</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default ExerciseDistributionChart;