import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import ReusableTable from '../ReusableComponent';
import CustomModal from '../CustomModal';

// Enhanced validation schema with calories field
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Exercise name is required')
    .min(3, 'Exercise name must be at least 3 characters')
    .max(50, 'Exercise name cannot exceed 50 characters'),
  muscleGroup: Yup.string()
    .required('Muscle group is required'),
  equipment: Yup.string()
    .required('Equipment is required')
    .min(3, 'Equipment name must be at least 3 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description cannot exceed 200 characters'),
  repetitions: Yup.number()
    .typeError('Repetitions must be a number')
    .required('Repetitions are required')
    .positive('Repetitions must be a positive number')
    .integer('Repetitions must be an integer')
    .min(1, 'Repetitions must be at least 1')
    .max(100, 'Repetitions cannot exceed 100'),
  calories: Yup.number()
    .typeError('Calories must be a number')
    .required('Calories are required')
    .positive('Calories must be a positive number')
    .min(1, 'Calories must be at least 1'),
});

const ExerciseForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [exercises, setExercises] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ids, setIds] = useState([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const headers = ['Exercise Name', 'Muscle Group', 'Equipment', 'Repetitions', 'Calories', 'Delete'];

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/exercises?page=${page+1}&limit=${rowsPerPage}`);
        const exes = response.data.exercises.map((exer) => ([
          exer.name,
          exer.muscleGroup,
          exer.equipment,
          exer.repetitions,
          exer.calories, // Fetch calories
        ]));
        const id_ = response.data.exercises.map((er) => er._id);
        setIds(id_);
        setExercises(exes);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };
    fetchExercises();
  }, [page, rowsPerPage]);

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:3002/create-exercise', data);
      const response = await axios.get(`http://localhost:3002/exercises?page=${page+1}&limit=${rowsPerPage}`);
      const exes = response.data.exercises.map((exer) => ([
        exer.name,
        exer.muscleGroup,
        exer.equipment,
        exer.repetitions,
        exer.calories, // Include calories in table update
      ]));
      const id_ = response.data.exercises.map((er) => er._id);
      setIds(id_);
      setOpen(false);
      setExercises(exes);
      reset(); // Clear form fields
    } catch (error) {
      alert('Error creating exercise');
    }
  };

  const handleDeleteRow = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/exercise/${id}`);
      const response = await axios.get(`http://localhost:3002/exercises?page=${page+1}&limit=${rowsPerPage}`);
      const exes = response.data.exercises.map((exer) => ([
        exer.name,
        exer.muscleGroup,
        exer.equipment,
        exer.repetitions,
        exer.calories, // Include calories in table after delete
      ]));
      const id_ = response.data.exercises.map((er) => er._id);
      setIds(id_);
      setOpen(false);
      setExercises(exes);
      reset(); // Clear form fields
    } catch (error) {
      alert('Error deleting exercise');
      console.error(error);
    }
  }

  return (
     <div style={{ margin: '1vw' }}>
      <div style={{ textAlign: 'right' }}>
          <Button variant="contained" onClick={handleOpen}>Create Exercise</Button>
      </div>
      <CustomModal open={open} handleClose={handleClose} title="Create Exercise">
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Exercise Name"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ''}
            />
            <TextField
              label="Muscle Group"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register('muscleGroup')}
              error={!!errors.muscleGroup}
              helperText={errors.muscleGroup ? errors.muscleGroup.message : ''}
            />
            <TextField
              label="Equipment"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register('equipment')}
              error={!!errors.equipment}
              helperText={errors.equipment ? errors.equipment.message : ''}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description ? errors.description.message : ''}
            />
            <TextField
              label="Repetitions"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              {...register('repetitions')}
              error={!!errors.repetitions}
              helperText={errors.repetitions ? errors.repetitions.message : ''}
            />
            <TextField
              label="Calories"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              {...register('calories')}
              error={!!errors.calories}
              helperText={errors.calories ? errors.calories.message : ''}
            />
            <div style={{
              display: 'flex',
              justifyContent:'space-between'
            }}>
              <Button variant="contained" color="primary" type="submit">
                Create Exercise
              </Button>
              <Button variant="contained" color="primary" onClick={() => {
                setOpen(false);
              }}>
                Close
              </Button>
            </div>
          </form>
        </>
      </CustomModal>

      <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>
        Exercises List
      </Typography>
      <ReusableTable 
        headers={headers} 
        ids={ids}
        rows={exercises} 
        rowsPerPage={rowsPerPage}  
        setRowsPerPage={setRowsPerPage}
        page={page}
        setPage={setPage} 
        handleDeleteRow={handleDeleteRow}
      />
    </div>
  )
}

export default ExerciseForm;
