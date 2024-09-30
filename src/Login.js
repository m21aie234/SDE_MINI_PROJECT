import React from 'react';
import { useForm } from 'react-hook-form';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  paper: {
    padding: 20,
    maxWidth: 400,
    margin: 'auto',
    marginTop: 50,
  },
  button: {
    marginTop: 20,
  },
});

const Login = () => {
  const classes = useStyles();
  
  // Initialize the useForm hook from react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_URL}/api/users/login`, data);
      localStorage.setItem('token', res.data.token);
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h5">Login</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Email Field */}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: 'Invalid email address',
              },
            })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
          />

          {/* Password Field */}
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
            })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={classes.button}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
