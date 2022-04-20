import React from 'react';
import { Box, Typography, Button, Link } from '@mui/material';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FTextField } from '../components/FTextField';
import { AuthPaper } from '../components/AuthPaper';
import { AuthService } from '../services/AuthService';
import swal from 'sweetalert';
import { AppContext } from '../context/context';
import { Helpers } from '../utilities/Helpers';
import BounceLoader from 'react-spinners/BounceLoader';
import { theme } from '../Theme';
import { useNavigate } from 'react-router-dom';

const ValidationSchema = Yup.object().shape({
  idNumber: Yup.string()
    .required('ID Number is a required field')
    .matches(
      /(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))/,
      'Please enter a valid ID number'
    ),
  password: Yup.string().required('Password is required'),
});

const useStyles = makeStyles(() => ({
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

const Signin = () => {
  const context: any = React.useContext(AppContext);
  const navigate = useNavigate();
  const classes = useStyles();

  return (
    <AuthPaper title="Welcome" subTitle="Sign into your account">
      <Box className={classes.formContainer}>
        <Box className={classes.subContainer}>
          <Formik
            initialValues={{ idNumber: '', password: '' }}
            validationSchema={ValidationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setSubmitting(true);
                const tempAuthService = new AuthService();
                const res = await tempAuthService.signinUser(values);

                if (res.success) {
                  await Helpers.setInStorage('token', res.accessToken);
                  context.user.update(res.data);
                  navigate('/dashboard')
                } else {
                  swal('Oops!!!', res.message, 'error');
                }
                setSubmitting(false);
              } catch (err) {
                console.log('err ', err)
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
                      type="password"
                      name="password"
                      label="Password"
                      placeholder="Password"
                    />
                  </Grid>
                  <Grid item xs={12} style={{ marginTop: 12 }}>
                    <Button type="submit" disabled={isSubmitting}>
                      {!isSubmitting ? (
                        'SIGN IN'
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
                      <Link href="signup" underline="hover">
                        Sign up
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

export default Signin;
