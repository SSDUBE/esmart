import { useNavigate } from 'react-router-dom';
import { Box, Button, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
// @ts-ignore
import Background from '../assets/videos/background.mp4';
import Fab from '@mui/material/Fab';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    flex: 1,
  },
  welcome: {
    textAlign: 'center',
    paddingTop: theme.spacing(8),
    color: theme.palette.common.white,
    fontSize: theme.spacing(4),
  },
  description: {
    textAlign: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    color: theme.palette.common.white,
    fontSize: theme.spacing(4),
    width: theme.spacing(85),
  },
  button: {
    width: theme.spacing(20),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(15),
  },
  socilaMedialContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(20),
  },
  socialMedia: {
    display: 'flex',
    justifyContent: 'space-between',
    width: theme.spacing(20),
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

const Welcome = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <video autoPlay muted loop className={classes.video}>
        <source src={Background} type="video/mp4" />
      </video>
      <Typography variant="h2" className={classes.welcome}>
        WELCOME TO ESMART
      </Typography>
      <Box display="flex" justifyContent="center">
        <Typography variant="h5" className={classes.description}>
          esmart is a gaming platform which allows students to compete in
          english game by getting a scrumble and deriving as many words as
          possible from the scrumble
        </Typography>
      </Box>

      <Box className={classes.buttonContainer}>
        <Box className={classes.button}>
          <Button onClick={() => navigate('/signin')}>GET STARTED</Button>
        </Box>
      </Box>

      <Box className={classes.socilaMedialContainer}>
        <Box className={classes.socialMedia}>
          <Fab
            size="small"
            color="primary"
            onClick={() => {
              window.open(
                'https://www.facebook.com/ESmart-Learning-Game-106088602149692/events/?ref=page_internal',
                '_blank'
              );
            }}
          >
            <FacebookIcon />
          </Fab>
          <Fab
            size="small"
            color="primary"
            onClick={() => {
              window.open(
                'https://www.instagram.com/invites/contact/?i=1dmf9bb6lmeim&utm_content=oqr7b4f',
                '_blank'
              );
            }}
          >
            <TwitterIcon />
          </Fab>
          <Fab
            size="small"
            color="primary"
            onClick={() => {
              window.open(
                'https://www.instagram.com/invites/contact/?i=1dmf9bb6lmeim&utm_content=oqr7b4f',
                '_blank'
              );
            }}
          >
            <InstagramIcon />
          </Fab>
        </Box>
      </Box>
    </Box>
  );
};

export default Welcome;
