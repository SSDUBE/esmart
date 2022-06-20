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

  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          <Typography color="inherit">Tooltip with HTML</Typography>
          <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '}
          {"It's very engaging. Right?"}
        </React.Fragment>
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
