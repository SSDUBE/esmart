import React from 'react';
import { Button, IconButton, Theme, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { MuiTable } from '../components/MuiTable';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';
import { ConfirmiationModal } from '../components/ConfirmitionModal';
import swal from 'sweetalert';
import { SchoolService } from '../services/SchoolService';
import dayjs from 'dayjs';
import { UserService } from '../services/UserService';

interface ITableData {
  schoolName: string;
  active: string;
  createdAt: string;
  updateAt: string;
  schoolId: number;
}

interface IColumn {
  id: 'schoolName' | 'active' | 'createdAt' | 'updateAt' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  format?: (value: number) => string;
}

const useStyles = makeStyles((theme: Theme) => ({
  iconButton: {
    backgroundColor: 'rgb(207, 213, 227)',
    width: theme.spacing(3.2),
    height: theme.spacing(3.2),
    borderRadius: 15,
    marginLeft: theme.spacing(1.5),
  },
  icon: {
    width: 17,
    height: 17,
    color: 'rgb(207, 213, 227)',
  },
}));

const columns: readonly IColumn[] = [
  {
    id: 'schoolName',
    label: 'School Name',
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'active',
    label: 'Active',
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'createdAt',
    label: 'Created At',
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'updateAt',
    label: 'Updated At',
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'actions',
    label: 'Actions',
    align: 'center',
    format: (value: number) => value.toFixed(2),
  },
];

export const SchoolManagement = () => {
  const classes = useStyles();
  const [rows, setRows] = React.useState<ITableData[]>([]);
  const [activateSchool, setActivateSchool] = React.useState(false);
  const [deactivateSchool, setDeactivateSchool] = React.useState(false);
  const [deactivateActivateId, setDeactivateActivateId] = React.useState(0);

  React.useEffect(() => {
    (async function () {
      try {
        const tempRows: ITableData[] = [];

        const school = new SchoolService();
        const schools = await school.all();

        schools.data.forEach((school: any) => {
          tempRows.push(
            // @ts-ignore
            createData({
              schoolId: school.schoolID,
              schoolName: school.schoolName,
              active: school.active ? 'True' : 'False',
              createdAt: dayjs(school.createdAt).format('YYYY/MM/DD mm:ss'),
              updateAt: dayjs(school.updatedAt).format('YYYY/MM/DD mm:ss'),
            })
          );
        });

        setRows(tempRows);
      } catch (err) {
        console.log('something went wrong loading ', err);
      }
    })();
  }, []);

  async function handleAction(
    action: string,
    actionType: boolean,
    schoolId: number
  ) {
    try {
      const tempRows = [...rows];
      const user = new UserService();
      const res: any = {};

      const index = tempRows.findIndex(
        (row) => row.schoolId === deactivateActivateId
      );

      if (action === 'activate') {
        const activate = await user.activateOrDeactivateSchool(
          true,
          deactivateActivateId
        );

        tempRows[index].active = 'True';
        swal('Hooray!!!', 'School was successfully activate', 'success');
      } else {
        const deactivate = await user.activateOrDeactivateSchool(
          false,
          deactivateActivateId
        );

        tempRows[index].active = 'False';
        swal('Hooray!!!', 'School was successfully deactivated', 'success');
      }

      setActivateSchool(false);
      setDeactivateSchool(false);
      setRows(tempRows);
    } catch (err) {
      setDeactivateSchool(false);
      swal('Oops!!!', 'Something went wrong please try again', 'error');
    }
  }

  function createData(data: ITableData) {
    const actions = (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button
          style={{ width: 30, height: 25, fontSize: 10 }}
          onClick={() => {
            setActivateSchool(true);
            setDeactivateActivateId(data.schoolId);
          }}
        >
          Activate
        </Button>
        <IconButton
          classes={{
            root: classes.iconButton,
          }}
          className={classes.iconButton}
          onClick={() => {
            setDeactivateSchool(true);
            setDeactivateActivateId(data.schoolId);
          }}
        >
          <DeleteIcon className={classes.icon} />
        </IconButton>
      </Box>
    );

    return { ...data, actions };
  }

  return (
    <Box>
      <Typography variant="h4" style={{ marginBottom: 14 }}>
        Schools
      </Typography>
      <MuiTable rows={rows} columns={columns} />
      <ConfirmiationModal
        handleConfirmation={() => handleAction('activate', true, 1)}
        showModal={activateSchool}
        closeModal={() => setActivateSchool(false)}
        title="Are you sure you want to activate school?"
      />
      <ConfirmiationModal
        handleConfirmation={() => handleAction('deactivate', true, 1)}
        showModal={deactivateSchool}
        closeModal={() => setDeactivateSchool(false)}
        title="Are you sure you want to deactivate school?"
      />
    </Box>
  );
};
