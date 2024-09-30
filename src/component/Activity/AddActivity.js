import React from 'react';
import { useForm } from 'react-hook-form';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  paper: {
    padding: 30,
    maxWidth: 500,
    margin: 'auto',
    marginTop: 60,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 600,
    color: '#333',
  },
  textField: {
    margin: '20 px !important',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#1976d2',
    color: '#fff',
    padding: '10px 0',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
  errorText: {
    color: 'red',
    fontSize: '0.875rem',
    marginTop: -15,
    marginBottom: 15,
  },
});

const AddActivity = () => {
  const classes = useStyles();

  // React Hook Form for handling form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await axios.post(process.env.REACT_APP_URL+'/api/activities/create', data,{
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token") //the token is a variable which holds the token
          }});
      alert('Activity added successfully!');
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  return (
    <Container>
      <Paper elevation={3} className={classes.paper}>
        <div>
            <Typography style={{ marginBottom: '10px' }} variant="h5" className={classes.formTitle}>
              Add New Activity
            </Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Activity Type Field */}
          <TextField
            label="Activity Type"
            variant="outlined"
            style={{ marginBottom: '10px' }}
            fullWidth
            className={classes.textField}
            {...register('type', {
              required: 'Activity type is required',
            })}
            error={!!errors.type}
            helperText={errors.type ? errors.type.message : ''}
          />

          {/* Duration Field */}
          <TextField
            label="Duration (in minutes)"
            variant="outlined"
            fullWidth
            style={{ marginBottom: '10px' }}
            type="number"
            className={classes.textField}
            {...register('duration', {
              required: 'Duration is required',
              min: {
                value: 1,
                message: 'Duration must be at least 1 minute',
              },
            })}
            error={!!errors.duration}
            helperText={errors.duration ? errors.duration.message : ''}
          />

          {/* Calories Burned Field */}
          <TextField
            label="Calories Burned"
            variant="outlined"
            fullWidth
            style={{ marginBottom: '10px' }}
            type="number"
            className={classes.textField}
            {...register('caloriesBurned', {
              required: 'Calories burned is required',
              min: {
                value: 1,
                message: 'Calories burned must be at least 1',
              },
            })}
            error={!!errors.caloriesBurned}
            helperText={errors.caloriesBurned ? errors.caloriesBurned.message : ''}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={classes.button}
          >
            Add Activity
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddActivity;
