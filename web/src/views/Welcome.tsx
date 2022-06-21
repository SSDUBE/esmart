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
    width: theme.spacing(85)
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
    marginTop: theme.spacing(10),
  },
  socialMedia: {
    display: 'flex',
    justifyContent: 'space-between',
    width: theme.spacing(20),
  },
}));

export const data = [
  {
    cover: 'https://images.unsplash.com/photo-1555431189-0fabf2667795?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    title: 'Interstaller',
  },
  {
    cover: 'https://images.unsplash.com/photo-1597392582469-a697322d5c16?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    title: 'Inception',
  },
  {
    cover: 'https://images.unsplash.com/photo-1592431913823-7af6b323da9b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    title: 'Blade Runner 2049',
  },
  {
    cover: 'https://images.unsplash.com/reserve/uZYSV4nuQeyq64azfVIn_15130980706_64134efc6e_o.jpg?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1167&q=80',
    title: 'Icon man 3',
  },
  {
    cover: 'https://images.unsplash.com/photo-1461958508236-9a742665a0d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    title: 'Venom',
  },
  {
    cover: 'https://images.unsplash.com/photo-1592431913823-7af6b323da9b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    title: 'Steins Gate',
  },
  {
    cover: 'https://images.unsplash.com/photo-1571149829199-33981870803f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    title: 'One Punch Man',
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
      <Box display='flex' justifyContent='center'>
        <Typography variant="h5" className={classes.description}>
          esmart is a gaming platform which allows students to compete in english
          game by getting a scrumble and deriving as many words as possible from
          the scrumble
        </Typography>
      </Box>
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
