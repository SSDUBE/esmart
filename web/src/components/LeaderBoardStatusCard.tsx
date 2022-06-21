import React, { FunctionComponent } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import SchoolIcon from '@mui/icons-material/School';
import BlockIcon from '@mui/icons-material/Block';
import game from '../assets/game.jpg';
import teacher from '../assets/school.jpeg';
import SchoolImg from '../assets/teacher.jpg';
import dayjs from 'dayjs';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.common.white,
    width: theme.spacing(22),
    height: theme.spacing(11),
    boxShadow: 'rgb(0 0 0 / 8%) 0px 6px 15px 0px',
    borderRadius: theme.spacing(2),
    cursor: 'pointer',
  },
  bitText: {
    color: 'rgb(140, 140, 140)',
  },
  bitNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 15,
  },
  tooltipContainer: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

interface Props {
  title: string;
  totalBit: number;
  status:
    | 'totalStudent'
    | 'totalTeachers'
    | 'totalGames'
    | 'totalSchools'
    | 'suspendedStudents';
}

export const LeaderBoardStatusCard: FunctionComponent<Props> = ({
  title,
  totalBit,
  status,
}) => {
  const classes = useStyles();

  const bitIcon = {
    totalStudent: <BookIcon style={{ color: '#4BED5B' }} />,
    totalTeachers: <PersonIcon style={{ color: '#EDAC4B' }} />,
    totalGames: <VideogameAssetIcon style={{ color: '#EE4C4C' }} />,
    totalSchools: <SchoolIcon style={{ color: '#D4D4D4' }} />,
    suspendedStudents: <BlockIcon style={{ color: '#EE4C4C' }} />,
  };

  const data: any = {
    'Total Students': {
      img: SchoolImg,
      text: (
        <em>
          {totalBit} student(s) where created this report if for{' '}
          {dayjs().format('DD/MM/YYYY')}
        </em>
      ),
    },
    'Total Teachers': {
      img: teacher,
      text: (
        <em>
          {totalBit} teacher(s) where created this report if for{' '}
          {dayjs().format('DD/MM/YYYY')}
        </em>
      ),
    },
    'Total Games': {
      img: game,
      text: (
        <em>
          {totalBit} game(s) where created this report if for{' '}
          {dayjs().format('DD/MM/YYYY')}
        </em>
      ),
    },
    'Total Schools': {
      img: SchoolImg,
      text: (
        <em>
          {totalBit} school(s) where created this report if for{' '}
          {dayjs().format('DD/MM/YYYY')}
        </em>
      ),
    },
    'Suspendend Students': {
      img: SchoolImg,
      text: (
        <em>
          {totalBit} student(s) where suspended this report if for{' '}
          {dayjs().format('DD/MM/YYYY')}
        </em>
      ),
    },
  };

  return (
    <HtmlTooltip
      title={
        <Box className={classes.tooltipContainer}>
          <img src={data[title].img} style={{ width: 30, height: 30 }} />
          <Box style={{ marginLeft: 9 }}>
            <Typography color="inherit">{title}</Typography>
            <br />
            {data[title].text}
          </Box>
        </Box>
      }
    >
      <Box className={classes.container}>
        {bitIcon[status]}
        <Box className={classes.contentWrapper}>
          <Typography className={classes.bitText}>{title}</Typography>
          <Typography className={classes.bitNumber}>{totalBit}</Typography>
        </Box>
      </Box>
    </HtmlTooltip>
  );
};
