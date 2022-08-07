import React from 'react';
import { Button, Grid, IconButton, Theme, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { MuiTable } from '../components/MuiTable';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { MuiModal } from '../components/MuiModal';
import { FTextField } from '../components/FTextField';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';
import { ConfirmiationModal } from '../components/ConfirmitionModal';
import { UserService } from '../services/UserService';
import { AppContext } from '../context/context';
import swal from 'sweetalert';
import dayjs from 'dayjs';
import { ComboBox } from '../components/MuiComboBox';
import { theme } from '../Theme';

const ValidationSchema = (validatePass: any, isEditing: boolean) =>
  Yup.object().shape({
    firstname: Yup.string()
      .required('First Name is required')
      .matches(
        /^[^\s][A-Za-z0-9\s]*[^\s]$/,
        'First Name cannot include leading and trailing spaces'
      ),
    lastname: Yup.string()
      .required('Last Name is required')
      .matches(
        /^[^\s][A-Za-z0-9\s]*[^\s]$/,
        'Last Name cannot include leading and trailing spaces'
      ),
    idNumber: Yup.string()
      .required('ID Number is a required field')
      .matches(
        /(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))/,
        'Please enter a valid ID number'
      )
      .min(13, 'ID number must contain a minimum of 13 digits')
      .max(13, 'ID number must contain a minimum of 13 digits'),
    contactNumber: isEditing
      ? Yup.string().required('Email is required')
      : Yup.string().optional(),
    email: Yup.string()
      .required('Email is required')
      .email('Please enter a valid email'),
    password: !validatePass
      ? Yup.string().matches(
          /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
          'Password must have atleast 1 upper character, one special character, one digit and must be lenght of 8'
        )
      : Yup.string().optional(),
    gradeType: Yup.object().when('roleType', {
      is: (roleType: any) => roleType && roleType.type === 'STUDENT',
      then: Yup.object().required('Grade is a required field'),
    }),
  });

interface ISelect {
  type: string;
  label: Number;
}

interface ITableData {
  active: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  roleType: string;
  grade: string;
  roleId?: string;
  classID?: string;
  contactNumber?: string;
  email?: string;
}

interface IColumn {
  id:
    | 'firstName'
    | 'lastName'
    | 'idNumber'
    | 'roleType'
    | 'grade'
    | 'active'
    | 'createdAt'
    | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  format?: (value: number) => string;
}

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    width: 17,
    height: 17,
    color: theme.palette.common.white,
  },
}));

const columns: readonly IColumn[] = [
  {
    id: 'firstName',
    label: 'First Name',
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
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
    id: 'roleType',
    label: 'Role',
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'grade',
    label: 'Grade',
    align: 'center',
    format: (value: number) => value.toFixed(0),
  },
  {
    id: 'active',
    label: 'Active',
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
    id: 'actions',
    label: 'Actions',
    align: 'center',
    format: (value: number) => value.toFixed(2),
  },
];

export const StudentManagement = () => {
  const classes = useStyles();
  const [showModal, setShowModal] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [confirmDeleteUser, setConfirmDeleteUser] = React.useState(false);
  const [grades, setGrades] = React.useState<ISelect[]>([]);
  const [rows, setRows] = React.useState<ITableData[]>([]);
  const [deleteUser, setDeleteUser] = React.useState<ITableData | null>(null);
  const [editUser, setEditUser] = React.useState<ITableData | null>(null);
  const context: any = React.useContext(AppContext);

  React.useEffect(() => {
    (async function () {
      try {
        const { schoolId, idNumber, roleType } = context.global.user;
        const tempRows: ITableData[] = [];
        const user = new UserService();

        const grades = await user.getGrades();
        const users = await user.getAllUsers(
          idNumber,
          schoolId,
          roleType,
          'STUDENT'
        );

        users.data.forEach((user: any) => {
          user.active = user.active ? 'True' : 'False';
          user.createdAt = dayjs(user.createdAt).format('YYYY/MM/DD mm:ss');
          tempRows.push(createData({ ...user }));
        });

        const fmtGrades = grades.data.map((g: any) => ({
          label: g.classID,
          type: g.grade,
        }));

        setRows(tempRows);
        setGrades(fmtGrades);
      } catch (err) {
        console.log('something went wrong loading ', err);
      }
    })();
  }, []);

  async function handleEdit(newUser: any) {
    try {
      const { schoolId } = context.global.user;
      const tempRows = [...rows];
      const user = new UserService();

      const addUser = {
        active: newUser.active,
        roleType: newUser.roleType,
        roleId: newUser.roleId,
        grade: newUser.grade,
        gradeId: newUser.gradeId,
        firstName: newUser.firstname,
        lastName: newUser.lastname,
        idNumber: newUser.idNumber,
        contactNumber: newUser.contactNumber,
        email: newUser.email,
        password: newUser.password,
        schoolID: schoolId || newUser.schoolID,
      };

      const res = await user.updateUser(addUser);

      const index = rows.findIndex((row) => {
        // @ts-ignore
        return (row.idNumber = editUser.idNumber);
      });

      if (res.success) {
        swal('Hooray!!!', 'User was successfully updated', 'success');
        tempRows[index] = createData(addUser);
        setRows(tempRows);
      } else {
        swal('Oops!!!', res.message, 'error');
      }
    } catch (err) {
      swal('Oops!!!', 'Something went wrong please try again', 'error');
    }
  }

  async function handleDelete() {
    try {
      if (deleteUser) {
        const user = new UserService();
        const tempRows = [...rows];
        const index = tempRows.findIndex(
          (row) => (row.idNumber = deleteUser?.idNumber)
        );
        const res = await user.deleteUser(deleteUser?.idNumber);

        setConfirmDeleteUser(false);

        if (res.success) {
          swal('Hooray!!!', 'User was successfully deleted', 'success');
          tempRows.splice(index, 1);
          setRows(tempRows);
        } else {
          swal('Oops!!!', res.message, 'error');
        }
      }
    } catch (err) {
      swal('Oops!!!', 'Something went wrong please try again', 'error');
    }
  }

  function createData(data: ITableData) {
    const { roleType } = context.global.user;
    const actions = (
      <Box display="flex" justifyContent="center" alignItems="center">
        {roleType !== 'ADMIN' && (
          <Button
            style={{ width: 20, height: 25 }}
            onClick={() => {
              setIsEditing(true);
              setShowModal(true);
              setEditUser(data);
            }}
          >
            Edit
          </Button>
        )}
        {(roleType === 'ADMIN' || roleType === 'PRINCIPAL') && (
          <IconButton
            sx={{
              backgroundColor: '#A8A8A8',
              width: theme.spacing(3.2),
              height: theme.spacing(3.2),
              borderRadius: 15,
              marginLeft: theme.spacing(1.5),
            }}
            onClick={() => {
              setDeleteUser(data);
              setConfirmDeleteUser(true);
            }}
          >
            <DeleteIcon className={classes.icon} />
          </IconButton>
        )}
      </Box>
    );

    return { ...data, actions };
  }

  const grade = grades.find(
    (grade: ISelect) => grade.type === editUser?.classID
  );

  return (
    <Box style={{ overflow: 'scroll' }}>
      <Typography variant="h4" style={{ marginBottom: 10 }}>
        Students
      </Typography>
      <Box style={{ width: 200, marginBottom: 20 }}>
        <Button
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
          }}
        >
          <AddCircleOutlineIcon style={{ marginRight: 10 }} />
          Add Student
        </Button>
      </Box>
      <MuiTable rows={rows} columns={columns} />
      <MuiModal open={showModal} setOnClose={setShowModal}>
        <Typography variant="h5">
          {isEditing ? 'Update Student' : 'Add Student'}
        </Typography>
        <Typography style={{ marginTop: 10, marginBottom: 15 }} component="div">
          Fill in all fields and click save to add a new user
        </Typography>
        <Formik
          initialValues={{
            firstname: editUser?.firstName || '',
            lastname: editUser?.lastName || '',
            idNumber: editUser?.idNumber || '',
            contactNumber: editUser?.contactNumber || '',
            email: editUser?.email || '',
            gradeType: grade || '',
            password: '',
          }}
          enableReinitialize={true}
          validationSchema={() => ValidationSchema(editUser, isEditing)}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              setSubmitting(true);
              const tempRows = [...rows];
              const { firstname, lastname, idNumber, gradeType, password } =
                values;
              const { schoolId } = context.global.user;
              const service = new UserService();
              const newUser = {
                firstname,
                idNumber,
                lastname,
                password,
                schoolId,
                email: values.email,
                // @ts-ignore
                gradeId: gradeType.type,
                roleType: 'STUDENT',
              };

              if (editUser) {
                await handleEdit({
                  ...newUser,
                  active: editUser.active,
                  contactNumber: values.contactNumber,
                });
              } else {
                const res = await service.addNewUser({ ...newUser });

                if (res.success) {
                  swal('Hooray!!!', 'User was successfully added', 'success');
                  tempRows.push(createData({ ...res.data }));
                  setRows(tempRows);
                  resetForm();
                  setShowModal(false);
                } else {
                  swal('Oops!!!', res.message, 'error');
                }
              }

              setSubmitting(false);
            } catch (err) {
              swal('Oops!!!', 'Something went wrong please try again', 'error');
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit} style={{ flex: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FTextField
                    type="text"
                    name="firstname"
                    label="First Name"
                    placeholder="Last Name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FTextField
                    type="text"
                    name="lastname"
                    label="Last Name"
                    placeholder="Last Name"
                  />
                </Grid>
                {isEditing && (
                  <Grid item xs={12}>
                    <FTextField
                      type="text"
                      name="contactNumber"
                      label="Contact Number"
                      placeholder="Contact Number"
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FTextField
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="Email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FTextField
                    type="text"
                    name="idNumber"
                    label="ID Number"
                    placeholder="ID Number"
                  />
                </Grid>
                <Grid item xs={12}>
                  <ComboBox
                    label="Student Grade"
                    data={grades}
                    defaultValue={values.gradeType}
                    error={errors.gradeType}
                    handleChange={(_: any, val: any) =>
                      setFieldValue('gradeType', val)
                    }
                  />
                </Grid>
                {/* {
                  //@ts-ignore
                  values.roleType.type === 'STUDENT' && (
                    <Grid item xs={12}>
                      <ComboBox
                        label="Student Grade"
                        data={grades}
                        defaultValue={values.gradeType}
                        error={errors.gradeType}
                        handleChange={(_: any, val: any) =>
                          setFieldValue('gradeType', val)
                        }
                      />
                    </Grid>
                  )
                } */}
                <Grid item xs={12}>
                  <FTextField
                    type="password"
                    name="password"
                    label="Login Password"
                    placeholder="Login Password"
                  />
                </Grid>
                <Box
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'flex-end',
                    marginTop: 30,
                  }}
                >
                  <Grid item xs={2} marginRight={2}>
                    <Button
                      onClick={() => {
                        setShowModal(false);
                        setEditUser(null);
                      }}
                      style={{
                        background: 'rgb(238, 239, 240)',
                        color: '#000',
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={2}>
                    <Button type="submit">Save</Button>
                  </Grid>
                </Box>
              </Grid>
            </form>
          )}
        </Formik>
      </MuiModal>
      <ConfirmiationModal
        handleConfirmation={handleDelete}
        showModal={confirmDeleteUser}
        closeModal={() => {
          setDeleteUser(null);
          setConfirmDeleteUser(false);
        }}
        title="Are you sure you want to delete this user?"
      />
    </Box>
  );
};
