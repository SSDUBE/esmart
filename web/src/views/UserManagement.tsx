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

const ValidationSchema = Yup.object().shape({
  firstname: Yup.string().required('Name is required'),
  lastname: Yup.string().required('Last name is required'),
  idNumber: Yup.string().required('Name is required'),
  loginCode: Yup.string().required('Name is required'),
  roleType: Yup.object().required('Please select access type'),
});

interface IData {
  username: string;
  fullName: string;
  number: string;
  access: string;
  actions: JSX.Element;
}

interface IRole {
  _id: string;
  type: string;
  description: string;
}

interface IColumn {
  id: 'username' | 'fullName' | 'number' | 'email' | 'access' | 'actions';
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

export const UserManagement = () => {
  const classes = useStyles();
  const [showModal, setShowModal] = React.useState(false);
  const [confirmDeleteUser, setConfirmDeleteUser] = React.useState(false);
  const [roles, setRoles] = React.useState([]);
  const [mobilenetModel, setMobilenetModel] =
    React.useState<mobilenet.MobileNet | null>(null);

  const [knnClassifierModel, setKnnClassifierModel] =
    React.useState<knnClassifier.KNNClassifier | null>(null);

  React.useEffect(() => {
    (async function () {
      try {
        const user = new UserService()
        const roles = await user.getRoles()
        const net = await mobilenet.load();
        const classifier = await knnClassifier.create();
        const res = roles.data.map((role: IRole)=> (
          {label: role.type, type: role.type, id: role._id}
        ))

        setRoles(res)
        setMobilenetModel(net);
        setKnnClassifierModel(classifier);
      } catch (err) {
        console.log('something went wrong loading ', err);
      }
    })();
  }, []);

  function handleDelete() {}

  function createData(
    username: string,
    fullName: string,
    number: string,
    access: string
  ): IData {
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
    return { username, fullName, number, access, actions };
  }

  const rows = [createData('India', 'IN', '1324171354', '3287263')];

  const columns: readonly IColumn[] = [
    {
      id: 'username',
      label: 'Username',
      align: 'center',
    },
    {
      id: 'fullName',
      label: 'Full Name',
      align: 'center',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'number',
      label: 'Number',
      align: 'center',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'email',
      label: 'Email',
      align: 'center',
      format: (value: number) => value.toFixed(2),
    },
    {
      id: 'access',
      label: 'Access',
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

  function base64ImageToTensor(base64: string) {
    //Function to convert jpeg image to tensors
    // console.log('base64 ', base64.split(',')[1])
    const binary_string = window.atob(base64.split(',')[1]);
    const len = binary_string.length;
    const bytes = new Uint8Array(224 * 224 * 3);

    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }

    return tf.tensor3d(bytes, [224, 224, 3]);
  }

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
            loginCode: '',
          }}
          validationSchema={ValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log('values ', values);
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
                <Grid item xs={12}>
                  <FTextField
                    type="loginCode"
                    name="loginCode"
                    label="Login Code"
                    placeholder="Login Code"
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
