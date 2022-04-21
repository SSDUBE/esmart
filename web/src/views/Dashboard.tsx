import { Theme } from '@mui/material';
import { Box } from '@mui/system';
import { MuiTable } from '../components/MuiTable';
import { makeStyles } from '@mui/styles';

interface IData {
  firstName: string;
  lastName: string;
  idNumber: string;
  score: string;
  createdAt: string;
  updatedAt: string;
}

interface IColumn {
  id: 'firstName' | 'lastName' | 'idNumber' | 'score' | 'createdAt' | 'updatedAt';
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
    firstName: string,
    lastName: string,
    idNumber: string,
    score: string,
    createdAt: string,
    updatedAt: string
  ): IData {
    return { firstName, lastName, idNumber, score, createdAt, updatedAt };
  }

  const rows = [
    createData('Sindiso', 'Dube', '9402226147089', '30', '2022/04/20', '2022/04/20'),
  ];

  const columns: readonly IColumn[] = [
    {
      id: 'firstName',
      label: 'Fist Name',
      align: 'center',
    },
    {
      id: 'lastName',
      label: 'Last Name',
      align: 'center',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'idNumber',
      label: 'ID Number',
      align: 'center',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'score',
      label: 'Score',
      align: 'center',
      format: (value: number) => value.toFixed(2),
    },
    {
      id: 'createdAt',
      label: 'Created At',
      align: 'center',
      format: (value: number) => value.toFixed(2),
    },
    {
      id: 'updatedAt',
      label: 'Updated At',
      align: 'center',
      format: (value: number) => value.toFixed(2),
    }
  ];

  return (
    <Box>
      <Box className={classes.tableContainer}>
        <MuiTable rows={rows} columns={columns} tableHeader="Leader board" />
      </Box>
    </Box>
  );
};
