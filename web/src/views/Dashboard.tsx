import React from 'react';
import { Theme, Typography, Grid, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { MuiTable } from '../components/MuiTable';
import { makeStyles } from '@mui/styles';
import { AppContext } from '../context/context';
import { UserService } from '../services/UserService';
import dayjs from 'dayjs';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import { LeaderBoardStatusCard } from '../components/LeaderBoardStatusCard';
import { LeaderBoardStatus } from '../constants';
import { theme } from '../Theme';
// @ts-ignore
import ReactExport from 'react-export-excel';
import { downloadWord } from '../components/DownloadWord';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

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
  excelText: {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: theme.palette.primary.dark,
  },
  excelContainer: {
    marginRight: theme.spacing(2),
  },
}));

const styles = StyleSheet.create({
  text: {
    fontSize: 8,
    marginRight: 15,
  },
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  tableContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 12,
    marginLeft: 12,
  },
  title: {
    marginBottom: theme.spacing(2),
  },
});

export const Dashboard = () => {
  const context: any = React.useContext(AppContext);
  const classes = useStyles();
  const [rows, setRows] = React.useState<ITableData[]>([]);
  const [filteredRow, setFilteredRows] = React.useState<ITableData[]>([]);
  const [tileData, setTileData] = React.useState<any>({});

  React.useEffect(() => {
    (async function () {
      const { schoolId } = context.global.user;
      const user = new UserService();
      const leaderboard = await user.getLeaderboard(schoolId);
      const dashboardData = await user.getDashboardData();
      const tempRows: ITableData[] = [];

      leaderboard.data.forEach((board: any) => {
        const createdAt = dayjs(board.createdAt).format('YYYY/MM/DD mm:ss');

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
      setFilteredRows(tempRows);
      setTileData(dashboardData.data);
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

  function PDF() {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={[styles.tableContainer, { marginTop: 15 }]}>
            <Text style={[styles.text, { width: '6%' }]}>Number</Text>
            <Text style={[styles.text, { width: '10%' }]}>First Name</Text>
            <Text style={[styles.text, { width: '10%' }]}>Last Name</Text>
            <Text style={[styles.text, { width: '12%' }]}>ID Number</Text>
            <Text style={[styles.text, { width: '5%' }]}>Score</Text>
            <Text style={[styles.text, { width: '3%' }]}>Class</Text>
            <Text style={[styles.text, { width: '12%' }]}>Created at</Text>
          </View>
          {rows.map((row, index) => (
            <View key={row.classID} style={styles.tableContainer}>
              <Text style={[styles.text, { width: '6%' }]}>{index + 1}</Text>
              <Text style={[styles.text, { width: '10%' }]}>
                {row.firstName}
              </Text>
              <Text style={[styles.text, { width: '10%' }]}>
                {row.lastName}
              </Text>
              <Text style={[styles.text, { width: '12%' }]}>
                {row.idNumber}
              </Text>
              <Text style={[styles.text, { width: '5%' }]}>{row.score}</Text>
              <Text style={[styles.text, { width: '3%' }]}>{row.classID}</Text>
              <Text style={[styles.text, { width: '12%' }]}>
                {row.createdAt}
              </Text>
            </View>
          ))}
        </Page>
      </Document>
    );
  }

  function downloadExcel() {
    const tempRows = [...rows];

    return (
      <ExcelFile
        element={
          <Typography className={classes.excelText}>Download Excel!</Typography>
        }
      >
        <ExcelSheet data={tempRows} name="Student Report">
          <ExcelColumn label="First Name" value="lastName" />
          <ExcelColumn label="ID Number" value="idNumber" />
          <ExcelColumn label="Score" value="score" />
          <ExcelColumn label="Score" value="score" />
          <ExcelColumn label="Class" value="classID" />
          <ExcelColumn label="Created At" value="createdAt" />
        </ExcelSheet>
      </ExcelFile>
    );
  }

  function handleChange(val: any) {
    const temp = [...rows];
    const res = temp.filter((item) =>
      item.firstName.toLowerCase().includes(val.target.value.toLowerCase())
    );
    setFilteredRows(res);
  }

  const { roleType } = context.global.user;

  return (
    <Box>
      <Typography variant="h4" style={{ marginBottom: 30 }}>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        {roleType === 'ADMIN' &&
          LeaderBoardStatus.map((item, idx) => {
            return (
              <Grid item xs={4} md={2} key={idx}>
                <LeaderBoardStatusCard
                  title={item.name}
                  totalBit={tileData[Object.keys(tileData)[idx]]}
                  status={item.status}
                />
              </Grid>
            );
          })}
      </Grid>
      <Box style={{ marginTop: 30 }} display="flex" justifyContent="flex-end">
        <TextField
          style={{ width: 500 }}
          id="outlined-required"
          label="Search Student"
          onChange={handleChange}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" style={{ marginTop: 30 }}>
        <Box className={classes.excelContainer}>
          <Typography
            className={classes.excelText}
            onClick={() => downloadWord(rows)}
          >
            Download Word!
          </Typography>
        </Box>
        <Box className={classes.excelContainer}>{downloadExcel()}</Box>
        <PDFDownloadLink
          document={<PDF />}
          fileName="report.pdf"
          style={{ color: theme.palette.primary.dark }}
        >
          {({ blob, url, loading, error }) =>
            loading ? 'Loading document...' : 'Download Pdf!'
          }
        </PDFDownloadLink>
      </Box>
      <Box className={classes.tableContainer}>
        <MuiTable rows={filteredRow} columns={columns} />
      </Box>
    </Box>
  );
};
