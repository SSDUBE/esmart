import React from 'react';
import { Box, Theme, Typography, Button, Link } from '@mui/material';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FTextField } from '../components/FTextField';
import { AuthPaper } from '../components/AuthPaper';
import { AuthService } from '../services/AuthService';
import BounceLoader from 'react-spinners/BounceLoader';
import { theme } from '../Theme';
import swal from 'sweetalert';

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
  password: Yup.string()
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
      'Password must have atleast 1 upper character, one special character, one digit and must be lenght of 8'
    )
    .required('Password is required'),
  repeatPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords do not match'
  ),
  schoolName: Yup.string()
    .matches(
      /^[^\s][A-Za-z0-9\s]*[^\s]$/,
      'School name cannot include leading and trailing spaces'
    )
    .required('School Name is required'),
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

const Signup = () => {
  const classes = useStyles();

  return (
    <AuthPaper
      title="Join us today"
      subTitle="Enter your email and password to register"
    >
      <Box className={classes.formContainer}>
        <Box className={classes.subContainer}>
          <Formik
            initialValues={{
              email: '',
              password: '',
              repeatPassword: '',
              idNumber: '',
              schoolName: '',
            }}
            enableReinitialize={true}
            validationSchema={ValidationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                setSubmitting(true);
                const tempAuthService = new AuthService();
                const res = await tempAuthService.signupUser(values);

                if (res.success) {
                  swal('Hooray!!!', res.message, 'success');
                  resetForm()
                } else {
                  swal('Oops!!!', res.message, 'error');
                }
                setSubmitting(false);
              } catch (err) {
                swal(
                  'Oops!!!',
                  'Something went wrong please try again',
                  'error'
                );
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
                      type="text"
                      name="schoolName"
                      label="School Name"
                      placeholder="School Name"
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
                        'SIGN UP'
                      ) : (
                        <BounceLoader
                          size={25}
                          color={theme.palette.common.white}
                          loading={true}
                        />
                      )}
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      marginTop: 12,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography>
                      Don't have an account?{' '}
                      <Link href="signin" underline="hover">
                        Sign in
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </AuthPaper>
  );
};

export default Signup;
