import React from 'react';
import { Box, Theme, Button, Link, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FTextField } from '../components/FTextField';
import { AuthService } from '../services/AuthService';
import BounceLoader from 'react-spinners/BounceLoader';
import { theme } from '../Theme';
import swal from 'sweetalert';
import { AppContext } from '../context/context';
import { UserService } from '../services/UserService';

const ValidationSchema = Yup.object().shape({
  idNumber: Yup.string()
    .required('ID Number is a required field')
    .matches(
      /(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))/,
      'Please enter a valid ID number'
    )
    .min(13, 'ID number must contain a minimum of 13 digits')
    .max(13, 'ID number must contain a minimum of 13 digits'),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
  password: Yup.string().optional(),
  repeatPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords do not match'
  ),
  // schoolName: Yup.string()
  //   .required('School Name is required')
  //   .matches(
  //     /^[^\s][A-Za-z0-9\s]*[^\s]$/,
  //     'First Name cannot include leading and trailing spaces'
  //   ),
  firstName: Yup.string()
    .matches(
      /^[^\s][A-Za-z0-9\s]*[^\s]$/,
      'First Name cannot include leading and trailing spaces'
    )
    .required('School Name is required'),
  lastName: Yup.string()
    .matches(
      /^[^\s][A-Za-z0-9\s]*[^\s]$/,
      'Last Name cannot include leading and trailing spaces'
    )
    .required('School Name is required'),
  contactNumber: Yup.string().required('School Name is required'),
});

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: '100vh',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    width: 600,
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const UpdateProfile = () => {
  const classes = useStyles();

  const context: any = React.useContext(AppContext);
  const { user, global } = context;

  return (
    <Box className={classes.formContainer}>
      <Box className={classes.subContainer}>
        <Typography variant="h4" style={{ marginBottom: 15 }}>
          Profile
        </Typography>
        <Formik
          initialValues={{
            firstName: global.user.firstName,
            lastName: global.user.lastName,
            contactNumber: global.user.contactNumber,
            email: global.user.email,
            idNumber: global.user.idNumber,
            schoolName: global.user.schoolName ? global.user.schoolName : 'N/A',
            password: '',
            repeatPassword: '',
          }}
          enableReinitialize={true}
          validationSchema={ValidationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setSubmitting(true);
              const service = new UserService();

              const newUser = {
                firstName: values.firstName,
                lastName: values.lastName,
                contactNumber: values.contactNumber,
                email: values.email,
                idNumber: values.idNumber,
                password: values.password,
                roleType: global.user.roleType,
              };

              const res = await service.updateUser(newUser);

              if (res.success) {
                swal('Hooray!!!', 'Profile successfuly updated', 'success');
                user.updateProfile(newUser);
              } else {
                swal('Oops!!!', res.message, 'error');
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
          }) => (
            <form onSubmit={handleSubmit} style={{ flex: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FTextField
                    type="text"
                    name="firstName"
                    label="First Name"
                    placeholder="First Name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FTextField
                    type="text"
                    name="lastName"
                    label="last Name"
                    placeholder="Last Name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FTextField
                    type="text"
                    name="contactNumber"
                    label="Contact Number"
                    placeholder="Contact Number"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FTextField
                    disabled
                    type="text"
                    name="schoolName"
                    label="School Name"
                    placeholder="School Name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FTextField
                    disabled
                    type="text"
                    name="idNumber"
                    label="ID Number"
                    placeholder="ID Number"
                  />
                </Grid>
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
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FTextField
                    type="password"
                    name="repeatPassword"
                    label="Repeat Password"
                    placeholder="Repeat Password"
                  />
                </Grid>
                <Grid item xs={12} style={{ marginTop: 12 }}>
                  <Button type="submit" disabled={isSubmitting}>
                    {!isSubmitting ? (
                      'UPDATE PROFILE'
                    ) : (
                      <BounceLoader
                        size={25}
                        color={theme.palette.common.white}
                        loading={true}
                      />
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};
