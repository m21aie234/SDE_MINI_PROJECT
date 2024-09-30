import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, Dialog, DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';
import ReusableTable from '../ReusableComponent';
import CustomModal from '../CustomModal';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Workout name is required')
    .min(3, 'Workout name must be at least 3 characters')
    .max(50, 'Workout name cannot exceed 50 characters'),
  duration: Yup.number()
    .typeError('Duration must be a number')
    .required('Duration is required')
    .positive('Duration must be a positive number')
    .integer('Duration must be an integer')
    .min(5, 'Duration must be at least 5 minutes')
    .max(300, 'Duration cannot exceed 300 minutes'),
  difficulty: Yup.string()
    .required('Difficulty is required'),
  exercises: Yup.array()
    .min(1, 'At least one exercise must be selected')
    .required('Exercises are required'),
});

const WorkoutForm = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });
  
  const [workouts, setWorkouts] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ids, setIds] = useState([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [activeWorkout, setActiveWorkout] = useState(null);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const headers = ['Workout Name', 'Duration (min)', 'Difficulty', 'Status', 'Calories Burned', 'Start','Actions'];

  // Fetch exercises from API
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get('http://localhost:3002/exercises');
        setExercises(response.data.exercises);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };
    fetchExercises();
  }, []);

  // Fetch workouts from API
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/workouts?page=${page + 1}&limit=${rowsPerPage}`);
        const workoutData = response.data.workouts.map((workout) => ([
          workout.name,
          workout.duration,
          workout.difficulty,
          workout.status,
          workout.calories,
        ]));
        const id_ = response.data.workouts.map((workout) => workout._id);
        setIds(id_);
        setWorkouts(workoutData);
        setSelectedExercises([]);
        setTotalCalories(0);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };
    fetchWorkouts();
  }, [page, rowsPerPage]);

  const onSubmit = async (data) => {
    try {
      const selectedExerciseDetails = exercises.filter((exercise) =>
        selectedExercises.includes(exercise._id)
      );
      const calories = selectedExerciseDetails.reduce((sum, exercise) => sum + exercise.calories, 0);
      const workoutData = {
        ...data,
        exercises: selectedExercises,
        calories,
      };

      await axios.post('http://localhost:3003/create-workout', workoutData);

      const response = await axios.get(`http://localhost:3003/workouts?page=${page + 1}&limit=${rowsPerPage}`);
      const workoutDataList = response.data.workouts.map((workout) => ([
        workout.name,
        workout.duration,
        workout.difficulty,
        workout.status,
        workout.calories,
      ]));
      const id_ = response.data.workouts.map((workout) => workout._id);
      setIds(id_);
      setOpen(false);
      setWorkouts(workoutDataList);
      setSelectedExercises([]);
      setTotalCalories(0);
      reset();
    } catch (error) {
      alert('Error creating workout');
    }
  };

  const handleDeleteRow = async (id) => {
    try {
      await axios.delete(`http://localhost:3003/workout/${id}`);
      const response = await axios.get(`http://localhost:3003/workouts?page=${page + 1}&limit=${rowsPerPage}`);
      const workoutDataList = response.data.workouts.map((workout) => ([
        workout.name,
        workout.duration,
        workout.difficulty,
        workout.status,
        workout.calories,
      ]));
      const id_ = response.data.workouts.map((workout) => workout._id);
      setIds(id_);
      setOpen(false);
      setWorkouts(workoutDataList);
      setSelectedExercises([]);
      setTotalCalories(0);
      reset();
    } catch (error) {
      alert('Error deleting workout');
    }
  };

  const handleExerciseChange = (event) => {
    const selectedIds = event.target.value;
    setSelectedExercises(selectedIds);
    setValue("exercises", event.target.value);
    const selectedExerciseDetails = exercises.filter((exercise) =>
      selectedIds.includes(exercise._id)
    );
    const calories = selectedExerciseDetails.reduce((sum, exercise) => sum + exercise.calories, 0);
    setTotalCalories(calories);
  };

  // Start workout
  const startWorkout = async (workoutId) => {
    const workout =  await axios.get(`http://localhost:3003/workout/${workoutId}`);
    setActiveWorkout(() => workout.data);
    setTimerModalOpen(true);
  };

  return (
    <div style={{ margin: '1vw' }}>
      <div style={{ textAlign: 'right' }}>
        <Button variant="contained" style={{ marginBottom: '10px' }} onClick={handleOpen}>Create Workout</Button>
      </div>
      <CustomModal open={open} handleClose={handleClose} title="Create Workout">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Workout Name"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ''}
          />
          <TextField
            label="Duration (min)"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            {...register('duration')}
            error={!!errors.duration}
            helperText={errors.duration ? errors.duration.message : ''}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Difficulty</InputLabel>
            <Select
              label="Difficulty"
              fullWidth
              {...register('difficulty')}
              error={!!errors.difficulty}
              defaultValue=""
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </Select>
            {errors.difficulty && <Typography color="error">{errors.difficulty.message}</Typography>}
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Exercises</InputLabel>
            <Select
              multiple
              value={selectedExercises}
              onChange={handleExerciseChange}
              renderValue={(selected) =>
                exercises
                  .filter((exercise) => selected.includes(exercise._id))
                  .map((exercise) => exercise.name)
                  .join(', ')
              }
            >
              {exercises.map((exercise) => (
                <MenuItem key={exercise._id} value={exercise._id}>
                  <Checkbox checked={selectedExercises.includes(exercise._id)} />
                  <ListItemText primary={exercise.name} />
                </MenuItem>
              ))}
            </Select>
            {errors.exercises && <Typography color="error">{errors.exercises.message}</Typography>}
          </FormControl>
          <Typography variant="body2" style={{ marginTop: '1rem' }}>
            Total Calories: {totalCalories} kcal
          </Typography>
          <Button type="submit" variant="contained" fullWidth style={{ marginTop: '1rem' }}>
            Create Workout
          </Button>
        </form>
      </CustomModal>

      <ReusableTable 
        headers={headers} 
        ids={ids}
        rows={workouts.map((workout, index) => ([
          ...workout,
          (workout[3] !== "completed" && <div>
            <Button variant="contained" onClick={() => startWorkout(ids[index])}>Start</Button>
          </div>)
        ]))} 
        rowsPerPage={rowsPerPage}  
        setRowsPerPage={setRowsPerPage}
        page={page}
        setPage={setPage} 
        handleDeleteRow={handleDeleteRow}
      />
      <Dialog open={timerModalOpen} onClose={() => setTimerModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Workout Timer</DialogTitle>
        <DialogContent>
          {activeWorkout !== undefined && activeWorkout && activeWorkout.exercisesDetails.map((ele) => (
            <p>{ele.name} - repetitions{ele.repetitions}</p>
          ))}
          <Button variant="contained" onClick={async () => {
            try {
              await axios.patch(`http://localhost:3003/workout/${activeWorkout.workout._id}/status`, { status: 'completed' });
              setTimerModalOpen(false);
              const response = await axios.get(`http://localhost:3003/workouts?page=${page + 1}&limit=${rowsPerPage}`);
              const workoutDataList = response.data.workouts.map((workout) => ([
                workout.name,
                workout.duration,
                workout.difficulty,
                workout.status,
                workout.calories,
              ]));
              const id_ = response.data.workouts.map((workout) => workout._id);
              setIds(id_);
              setOpen(false);
              setWorkouts(workoutDataList);
              setSelectedExercises([]);
              setTotalCalories(0);
              reset();
              window.location.reload();
            } catch (error) {
                console.error('Error updating workout status:', error);
            }
          }}>Mark as Complete</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutForm;
