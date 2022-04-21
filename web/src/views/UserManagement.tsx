import React from 'react';
import { Button, Grid, IconButton, Theme, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { MuiTable } from '../components/MuiTable';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { MuiModal } from '../components/MuiModal';
import { FTextField } from '../components/FTextField';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ComboBox } from '../components/MuiComboBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';
import { ConfirmiationModal } from '../components/ConfirmitionModal';
import { UserService } from '../services/UserService';
import { AppContext } from '../context/context';
import swal from 'sweetalert';

const ValidationSchema = (validatePass: any) =>
  Yup.object().shape({
    firstname: Yup.string().required('Name is required'),
    lastname: Yup.string().required('Last name is required'),
    idNumber: Yup.string().required('Name is required'),
    password: !validatePass
      ? Yup.string().required('Password is required')
      : Yup.string().optional(),
    roleType: Yup.object().required('Please select access type'),
    gradeType: Yup.object().when('roleType', {
      is: (roleType: any) => roleType && roleType.type === 'STUDENT',
      then: Yup.object().required('Grade is a required field'),
    }),
  });

interface IRole {
  id: string;
  _id: string;
  type: string;
  description: string;
}

interface IGrades {
  id: string;
  _id: string;
  grade: Number;
  wordLength: Number;
}

interface ITableData {
  firstName: string;
  lastName: string;
  idNumber: string;
  roleType: string;
  grade: string;
  roleId?: string;
  gradeId?: string;
}

interface IColumn {
  id: 'firstName' | 'lastName' | 'idNumber' | 'roleType' | 'grade' | 'actions';
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
    id: 'actions',
    label: 'Actions',
    align: 'center',
    format: (value: number) => value.toFixed(2),
  },
];

export const UserManagement = () => {
  const classes = useStyles();
  const [showModal, setShowModal] = React.useState(false);
  const [confirmDeleteUser, setConfirmDeleteUser] = React.useState(false);
  const [roles, setRoles] = React.useState([]);
  const [grades, setGrades] = React.useState([]);
  const [rows, setRows] = React.useState<ITableData[]>([]);
  const [deleteUser, setDeleteUser] = React.useState<ITableData | null>(null);
  const [editUser, setEditUser] = React.useState<ITableData | null>(null);
  const context: any = React.useContext(AppContext);

  React.useEffect(() => {
    (async function () {
      try {
        const { schoolId, _id } = context.global.user;
        const tempRows = [...rows];

        const user = new UserService();
        const roles = await user.getRoles();
        const grades = await user.getGrades();
        const users = await user.getAllUsers(_id, schoolId);

        users.data.forEach((user: any) => {
          tempRows.push(createData({ ...user }));
        });

        const fmtRoles = roles.data.map((role: IRole) => ({
          label: role.type,
          type: role.type,
          id: role._id,
        }));

        const fmtGrades = grades.data.map((g: IGrades) => ({
          label: g.grade,
          type: g.grade,
          id: g._id,
        }));

        setRows(tempRows);
        setRoles(fmtRoles);
        setGrades(fmtGrades);
      } catch (err) {
        console.log('something went wrong loading ', err);
      }
    })();
  }, []);

  async function handleEdit(newUser: any) {
    try {
      if (deleteUser) {
        // const user = new UserService();
        // const tempRows = [...rows];
        // const index = tempRows.findIndex(
        //   (row) => (row.idNumber = editUser?.idNumber)
        // );
        // if (res.success){
        //   swal('Hooray!!!', 'User was successfully deleted', 'success');
        //   tempRows.splice(index, 1);
        //   setRows(tempRows);
        // }  else {
        //   swal('Oops!!!', res.message, 'error');
        // }
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
    const actions = (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button
          style={{ width: 20, height: 25 }}
          onClick={() => {
            setShowModal(true);
            setEditUser(data);
          }}
        >
          Edit
        </Button>
        <IconButton
          classes={{
            root: classes.iconButton,
            // This gives a warning that "focusVisible" class doesn't exist
            //   on IconButton (which is true, it comes from ButtonBase).
            // focusVisible: classes.closeButton
          }}
          className={classes.iconButton}
          onClick={() => {
            setDeleteUser(data);
            setConfirmDeleteUser(true);
          }}
        >
          <DeleteIcon className={classes.icon} />
        </IconButton>
      </Box>
    );

    return { ...data, actions };
  }

  const role = roles.find((role: IRole) => role.id === editUser?.roleId);
  const grade = grades.find((grade: IGrades) => grade.id === editUser?.gradeId);

  return (
    <Box>
      <Box style={{ width: 150, marginBottom: 20 }}>
        <Button onClick={() => setShowModal(true)}>
          <AddCircleOutlineIcon style={{ marginRight: 10 }} />
          Add User
        </Button>
      </Box>
      <MuiTable rows={rows} columns={columns} />
      <MuiModal open={showModal} setOnClose={setShowModal}>
        <Typography variant="h5">Add User</Typography>
        <Typography style={{ marginTop: 10, marginBottom: 15 }} component="div">
          Fill in all fields and click save to add a new user
        </Typography>
        <Formik
          initialValues={{
            firstname: editUser?.firstName || '',
            lastname: editUser?.lastName || '',
            idNumber: editUser?.idNumber || '',
            roleType: role || '',
            gradeType: grade || '',
            password: '',
          }}
          enableReinitialize={true}
          validationSchema={() => ValidationSchema(editUser)}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              setSubmitting(true);
              const tempRows = [...rows];
              const {
                firstname,
                lastname,
                idNumber,
                roleType,
                gradeType,
                password,
              } = values;
              const { schoolId, schoolName } = context.global.user;
              const service = new UserService();
              const newUser = {
                firstname,
                idNumber,
                lastname,
                password,
                schoolId,
                schoolName,
                // @ts-ignore
                grade: gradeType.type,
                // @ts-ignore
                gradeId: gradeType.id,
                // @ts-ignore
                roleType: roleType.type,
                // @ts-ignore
                roleId: roleType.id,
              };

              if (editUser) {
                await handleEdit(newUser) 
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
                    type="firstname"
                    name="firstname"
                    label="First Name"
                    placeholder="Last Name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FTextField
                    type="lastname"
                    name="lastname"
                    label="Last Name"
                    placeholder="Last Name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FTextField
                    type="idNumber"
                    name="idNumber"
                    label="ID Number"
                    placeholder="ID Number"
                  />
                </Grid>
                <Grid item xs={12}>
                  <ComboBox
                    label="User Role"
                    data={roles}
                    defaultValue={values.roleType}
                    error={errors.roleType}
                    handleChange={(_: any, val: any) =>
                      setFieldValue('roleType', val)
                    }
                  />
                </Grid>
                {
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
                }
                <Grid item xs={12}>
                  <FTextField
                    type="password"
                    name="password"
                    label="Login Password"
                    placeholder="Login Password"
                  />
                </Grid>
                {/* <Grid>
                  <Camera
                    idealFacingMode={FACING_MODES.USER}
                    imageType={IMAGE_TYPES.JPG}
                    isMaxResolution={true}
                    isImageMirror={false}
                    isSilentMode={false}
                    isDisplayStartCameraError={true}
                    isFullscreen={false}
                    sizeFactor={1}
                    imageCompression={0.75}
                    idealResolution={{ width: 640, height: 480 }}
                    onTakePhoto={async (dataUri) => {
                      const imageTensor = base64ImageToTensor(dataUri);
                      const embeddings = await mobilenetModel!.infer(
                        imageTensor,
                        true
                      );
                      knnClassifierModel!.addExample(
                        embeddings,
                        'Class A'
                      );
                      console.log('data ', knnClassifierModel);
                    }}
                  />
                </Grid> */}
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
