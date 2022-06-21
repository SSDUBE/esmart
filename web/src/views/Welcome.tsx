import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Background from '../assets/background.jpg';
import {
  StackedCarousel,
  ResponsiveContainer,
} from 'react-stacked-center-carousel';
import Fab from '@mui/material/Fab';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBackIos';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    // height: '100%',
    zIndex: -1,
  },
  contentContainer: {},
  welcome: {
    textAlign: 'center',
    paddingTop: theme.spacing(8),
    color: theme.palette.primary.light,
    fontSize: theme.spacing(4),
  },
  description: {
    textAlign: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    color: theme.palette.primary.light,
    fontSize: theme.spacing(4),
  },
  button: {
    width: theme.spacing(20),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(5),
  },
  socilaMedialContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(10)
  },
  socialMedia: {
    display: 'flex',
    justifyContent: 'space-between',
    width: theme.spacing(20),
  },
}));

export const data = [
  {
    cover: 'https://images6.alphacoders.com/679/thumb-1920-679459.jpg',
    title: 'Interstaller',
  },
  {
    cover: 'https://images2.alphacoders.com/851/thumb-1920-85182.jpg',
    title: 'Inception',
  },
  {
    cover: 'https://images6.alphacoders.com/875/thumb-1920-875570.jpg',
    title: 'Blade Runner 2049',
  },
  {
    cover: 'https://images6.alphacoders.com/114/thumb-1920-1141749.jpg',
    title: 'Icon man 3',
  },
  {
    cover: 'https://images3.alphacoders.com/948/thumb-1920-948864.jpg',
    title: 'Venom',
  },
  {
    cover: 'https://images2.alphacoders.com/631/thumb-1920-631095.jpg',
    title: 'Steins Gate',
  },
  {
    cover: 'https://images4.alphacoders.com/665/thumb-1920-665242.png',
    title: 'One Punch Man',
  },
  {
    cover: 'https://images2.alphacoders.com/738/thumb-1920-738176.png',
    title: 'A Silent Voice',
  },
  {
    cover: 'https://images8.alphacoders.com/100/thumb-1920-1005531.jpg',
    title: 'Demon Slayer',
  },
  {
    cover: 'https://images2.alphacoders.com/582/thumb-1920-582804.png',
    title: 'Attack On Titan',
  },
];

const Welcome = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const ref = React.useRef<any>();

  const Card = React.memo(function (props: any) {
    const { data, dataIndex } = props;
    const { cover } = data[dataIndex];
    return (
      <div
        style={{
          width: '100%',
          height: 450,
          userSelect: 'none',
        }}
        className="my-slide-component"
      >
        <img
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            borderRadius: 0,
          }}
          draggable={false}
          src={cover}
        />
      </div>
    );
  });

  return (
    <Box className={classes.container}>
      <img src={Background} alt="logo" className={classes.backgroundImage} />
      <Typography variant="h2" className={classes.welcome}>
        WELCOME TO ESMART
      </Typography>
      <Typography variant="h5" className={classes.description}>
        esmart is a gaming platform
      </Typography>

      <Box style={{ width: '100%', position: 'relative' }}>
        <ResponsiveContainer
          carouselRef={ref}
          render={(parentWidth, carouselRef) => {
            // If you want to use a ref to call the method of StackedCarousel, you cannot set the ref directly on the carousel component
            // This is because ResponsiveContainer will not render the carousel before its parent's width is determined
            // parentWidth is determined after your parent component mounts. Thus if you set the ref directly it will not work since the carousel is not rendered
            // Thus you need to pass your ref object to the ResponsiveContainer as the carouselRef prop and in your render function you will receive this ref object
            let currentVisibleSlide = 5;
            if (parentWidth <= 1440) currentVisibleSlide = 3;
            if (parentWidth <= 1080) currentVisibleSlide = 1;
            return (
              <StackedCarousel
                ref={carouselRef}
                slideComponent={Card}
                slideWidth={parentWidth < 800 ? parentWidth - 40 : 750}
                carouselWidth={parentWidth}
                data={data}
                currentVisibleSlide={currentVisibleSlide}
                maxVisibleSlide={5}
                useGrabCursor
              />
            );
          }}
        />
        <>
          <Fab
            style={{ position: 'absolute', top: '40%', left: 10, zIndex: 10 }}
            size="small"
            color="primary"
            onClick={() => {
              ref.current?.goBack();
            }}
          >
            <ArrowBackIcon />
          </Fab>
          <Fab
            style={{ position: 'absolute', top: '40%', right: 10, zIndex: 10 }}
            size="small"
            color="primary"
            onClick={() => {
              ref.current?.goNext(6);
            }}
          >
            <ArrowForwardIcon />
          </Fab>
        </>
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
              ref.current?.goBack();
            }}
          >
            <FacebookIcon />
          </Fab>
          <Fab
            size="small"
            color="primary"
            onClick={() => {
              ref.current?.goBack();
            }}
          >
            <TwitterIcon />
          </Fab>
          <Fab
            size="small"
            color="primary"
            onClick={() => {
              ref.current?.goBack();
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
