import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExerciseDistributionChart from './ExerciseDistributionChart';

const ExerciseDistributionContainer = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchExerciseDistribution = async () => {
            try {
                const response = await axios.get('http://localhost:3002/exercise-distribution');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching exercise distribution:', error);
            }
        };
        fetchExerciseDistribution();
    }, []);

    return <ExerciseDistributionChart data={data} />;
};

export default ExerciseDistributionContainer;
