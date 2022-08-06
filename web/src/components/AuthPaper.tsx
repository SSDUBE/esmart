import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Typography, Paper, Theme } from '@mui/material';
// @ts-ignore
import Background from '../assets/videos/background.mp4';
import { theme } from '../Theme';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100vh',
    zIndex: -1,
  },
  paperContainer: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    padding: theme.spacing(5),
  },
  paper: {
    position: 'relative',
    background: theme.palette.common.white,
    width: theme.spacing(65),
  },
  header: {
    height: theme.spacing(18),
    background: theme.palette.primary.light,
    borderRadius: theme.spacing(2),
    marginTop: theme.spacing(-9),
    marginBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    height: '100vh',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -999,
  },
}));

interface Props {
  children: JSX.Element;
  title: string;
  subTitle: string;
}

export const AuthPaper = ({ children, title, subTitle }: Props) => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      {/* <img src={Background} alt="logo" className={classes.backgroundImage} /> */}
      <video autoPlay muted loop className={classes.video}>
        <source src={Background} type="video/mp4" />
      </video>
      <Box className={classes.paperContainer}>
        <Paper elevation={3} className={classes.paper}>
          <Box className={classes.subContainer}>
            <Box className={classes.header}>
              <Typography
                variant="h3"
                align="center"
                color={theme.palette.common.white}
              >
                {title}
              </Typography>
              <Typography align="center" color={theme.palette.common.white}>
                {subTitle}
              </Typography>
            </Box>
            {children}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
