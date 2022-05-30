import React from 'react';
import { Theme, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { MuiTable } from '../components/MuiTable';
import { makeStyles } from '@mui/styles';
import { AppContext } from '../context/context';
import { UserService } from '../services/UserService';
import dayjs from 'dayjs';

interface IData {
  firstName: string;
  lastName: string;
  idNumber: string;
  score: number;
  classID: string;
  createdAt: string;
}

interface ITableData {
  firstName: string;
  lastName: string;
  idNumber: string;
  score: string;
  createdAt: string;
  classID: number;
}
interface IColumn {
  id: 'firstName' | 'lastName' | 'idNumber' | 'score' | 'classID' | 'createdAt';
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
  const context: any = React.useContext(AppContext);
  const classes = useStyles();
  const [rows, setRows] = React.useState<ITableData[]>([]);

  React.useEffect(() => {
    (async function () {
      const { schoolId } = context.global.user;
      const user = new UserService();
      const leaderboard = await user.getLeaderboard(schoolId);
      const tempRows: ITableData[] = [];

      leaderboard.data.forEach((board: any) => {
        const createdAt = dayjs(board.createdAt).format('YYYY/MM/DD mm:ss')

        tempRows.push(
          // @ts-ignore
          createData({
            firstName: board.firstName,
            lastName: board.lastName,
            idNumber: board.idNumber,
            score: board.score,
            classID: board.classID,
            createdAt: createdAt,
          })
        );
      });

      setRows(tempRows);
    })();
  }, []);

  function createData({
    firstName,
    lastName,
    idNumber,
    score,
    classID,
    createdAt,
  }: IData) {
    return { firstName, lastName, idNumber, score, classID, createdAt };
  }

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
      id: 'classID',
      label: 'Class',
      align: 'center',
      format: (value: number) => value.toFixed(0),
    },
    {
      id: 'createdAt',
      label: 'Created At',
      align: 'center',
      format: (value: number) => value.toFixed(2),
    },
  ];

  return (
    <Box>
      <Typography variant="h4">Dashboard</Typography>
      <Box className={classes.tableContainer}>
        <MuiTable rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};
