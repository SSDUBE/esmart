import React from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

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
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { UserService } from '../services/UserService';
import { AppContext } from '../context/context';

const ValidationSchema = Yup.object().shape({
  firstname: Yup.string().required('Name is required'),
  lastname: Yup.string().required('Last name is required'),
  idNumber: Yup.string().required('Name is required'),
  password: Yup.string().required('Password is required'),
  roleType: Yup.object().required('Please select access type'),
  gradeType: Yup.object().when('roleType', {
    is: (roleType: any) => roleType && roleType.type === 'STUDENT',
    then: Yup.object().required('Grade is a required field'),
  }),
});

interface IRole {
  _id: string;
  type: string;
  description: string;
}

interface IGrades {
  _id: string;
  grade: Number;
  wordLength: Number;
}

interface ITableData {
  firstname: string,
  lastname: string,
  idNumber: string,
  role: string,
  grade: string
}

interface IColumn {
  id: 'firstname' | 'lastname' | 'idNumber' | 'role' | 'grade' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  format?: (value: number) => string;
}

const useStyles = makeStyles((theme: Theme) => ({
  iconButton: {
    background: 'rgb(207, 213, 227)',
    width: theme.spacing(3.2),
    height: theme.spacing(3.2),
    borderRadius: 15,
    marginLeft: theme.spacing(1.5),
  },
  icon: {
    width: 17,
    height: 17,
    color: '#fff',
  },
}));

const columns: readonly IColumn[] = [
  {
    id: 'firstname',
    label: 'First Name',
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'lastname',
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
    id: 'role',
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
  const context: any = React.useContext(AppContext);

  // const [mobilenetModel, setMobilenetModel] =
  //   React.useState<mobilenet.MobileNet | null>(null);

  // const [knnClassifierModel, setKnnClassifierModel] =
  //   React.useState<knnClassifier.KNNClassifier | null>(null);

  React.useEffect(() => {
    (async function () {
      try {
        const user = new UserService();
        const roles = await user.getRoles();
        const grades = await user.getGrades();

        // const net = await mobilenet.load();
        // const classifier = await knnClassifier.create();
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

        setRoles(fmtRoles);
        setGrades(fmtGrades);
        // setMobilenetModel(net);
        // setKnnClassifierModel(classifier);
      } catch (err) {
        console.log('something went wrong loading ', err);
      }
    })();
  }, []);

  function handleDelete() {}

  function createData(
    firstname: string,
    lastname: string,
    idNumber: string,
    role: string,
    grade: string
  ) {
    const actions = (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button style={{ width: 20, height: 25 }}>Edit</Button>
        <IconButton
          className={classes.iconButton}
          onClick={() => setConfirmDeleteUser(true)}
        >
          <DeleteIcon className={classes.icon} />
        </IconButton>
      </Box>
    );
    return { firstname, lastname, idNumber, role, grade, actions };
  }

  console.log('context ', context)
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
            firstname: '',
            lastname: '',
            idNumber: '',
            roleType: '',
            gradeType: '',
            password: '',
          }}
          validationSchema={ValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            const tempRows = [...rows];
            const {
              firstname,
              lastname,
              idNumber,
              roleType,
              gradeType,
              password,
            } = values;
            console.log('values ', values);

            tempRows.push(
              createData(
                firstname,
                lastname,
                idNumber,
                // @ts-ignore
                roleType.type,
                // @ts-ignore
                gradeType.type
              )
            );

            setRows(tempRows);
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
                      onClick={() => setShowModal(false)}
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
        setShowModal={setConfirmDeleteUser}
        title="Are you sure you want to delete this user?"
      />
    </Box>
  );
};
