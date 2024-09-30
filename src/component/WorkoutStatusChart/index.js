import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const WorkoutStatusChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchWorkoutStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3003/workout-status');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching workout status:', error);
            }
        };
        fetchWorkoutStatus();
    }, []);

    const chartData = {
        labels: data.map(item => item.status),
        datasets: [{
            data: data.map(item => item.count),
            backgroundColor: ['#FF6384', '#36A2EB'],
        }]
    };

    return (
        <div>
            <h2>Workout Completion Status</h2>
            <Pie data={chartData} />
        </div>
    );
};

export default WorkoutStatusChart;
