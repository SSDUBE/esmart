import { Theme, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { MuiTable } from '../components/MuiTable';
import { BitStatusColor } from '../constants';
import { makeStyles } from '@mui/styles';

interface IData {
  serial: string;
  size: string;
  currentRig: string;
  lastUser: string;
  meters: string;
  status: JSX.Element;
}

interface IColumn {
  id: 'serial' | 'currentRig' | 'size' | 'lastUser' | 'meters' | 'status';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  format?: (value: number) => string;
}

const useStyles = makeStyles((theme: Theme) => ({
  tableContainer: {
    marginTop: theme.spacing(2.5),
  },
  statusColor: {
    width: theme.spacing(1.2),
    height: theme.spacing(1.2),
    borderRadius: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

export const Dashboard = () => {
  const classes = useStyles();

  function createData(
    serial: string,
    size: string,
    currentRig: string,
    lastUser: string,
    meters: string,
    status: string
  ): IData {
    const statusData = (
      <Box display="flex" alignItems="center" justifyContent="center">
        <Box
          className={classes.statusColor}
          // @ts-ignore
          style={{ background: BitStatusColor[status.toLowerCase()] }}
        />
        <Typography>{status}</Typography>
      </Box>
    );
    return { serial, size, currentRig, lastUser, meters, status: statusData };
  }

  const rows = [
    createData('India', 'IN', '1324171354', '3287263', '111', 'New'),
  ];

  const columns: readonly IColumn[] = [
    {
      id: 'serial',
      label: 'Serial',
      align: 'center',
    },
    {
      id: 'size',
      label: 'Size',
      align: 'center',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'currentRig',
      label: 'Current Rig',
      align: 'center',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'lastUser',
      label: 'Last User',
      align: 'center',
      format: (value: number) => value.toFixed(2),
    },
    {
      id: 'meters',
      label: 'Meters',
      align: 'center',
      format: (value: number) => value.toFixed(2),
    },
    {
      id: 'status',
      label: 'Status',
      align: 'center',
      format: (value: number) => value.toFixed(2),
    },
  ];

  return (
    <Box>
      <Box className={classes.tableContainer}>
        <MuiTable rows={rows} columns={columns} tableHeader="Leader board" />
      </Box>
    </Box>
  );
};
