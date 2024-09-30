import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button  } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  appBar: {
    backgroundColor: '#1976d2', // Primary color
  },
  button: {
    marginLeft: '20px',
  },
});

const NavigationBar = () => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Fitness Tracker
        </Typography>
          <Button
                key={"Home"}
                onClick={() => {
                  window.location.href="/";
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Home
          </Button>
          <Button
                key={"Exercise"}
                onClick={() => {
                  window.location.href="/exercise";
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Exercise
          </Button>
          <Button
                key={"Workouts"}
                onClick={() => {
                  window.location.href="/workout";
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Workouts
          </Button>
          <Button color="inherit" onClick={() => {
              localStorage.clear();
              window.location.href="/login";
          }} component={Link} className={classes.button}>
            Logout
          </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
