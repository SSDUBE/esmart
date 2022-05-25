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

interface ITableData {
  schoolName: string;
  active: string;
  createdAt: string;
  updateAt: string;
  _id?: string;
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

  React.useEffect(() => {
    (async function () {
      try {
        const tempRows: ITableData[] = [];

        const school = new SchoolService();
        const schools = await school.all();

        schools.data.forEach((school: any) => {
          tempRows.push(
            createData({
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

  async function handleAction(action: string, actionType: boolean) {
    try {
      // if (deleteUser) {
      //   const user = new UserService();
      //   const tempRows = [...rows];
      //   const index = tempRows.findIndex(
      //     (row) => (row.idNumber = deleteUser?.idNumber)
      //   );
      //   const res = await user.deleteUser(deleteUser?.idNumber);
      //   setConfirmDeleteUser(false);
      //   if (res.success) {
      //     swal('Hooray!!!', 'User was successfully deleted', 'success');
      //     tempRows.splice(index, 1);
      //     setRows(tempRows);
      //   } else {
      //     swal('Oops!!!', res.message, 'error');
      //   }
      // }
    } catch (err) {
      swal('Oops!!!', 'Something went wrong please try again', 'error');
    }
  }

  function createData(data: ITableData) {
    const actions = (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button
          style={{ width: 30, height: 25, fontSize: 10 }}
          onClick={() => setActivateSchool(true)}
        >
          Activate
        </Button>
        <IconButton
          classes={{
            root: classes.iconButton,
          }}
          className={classes.iconButton}
          onClick={() => setDeactivateSchool(true)}
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
        handleConfirmation={() => handleAction('deactivate', true)}
        showModal={activateSchool}
        closeModal={() => setActivateSchool(false)}
        title="Are you sure you want to activate school?"
      />
      <ConfirmiationModal
        handleConfirmation={() => handleAction('deactivate', true)}
        showModal={deactivateSchool}
        closeModal={() => setDeactivateSchool(false)}
        title="Are you sure you want to deactivate school?"
      />
    </Box>
  );
};
