import { makeStyles } from '@mui/styles';
import { TextField, TextFieldProps, Theme } from '@mui/material';
import { useField } from 'formik';

const useStyles = makeStyles((theme: Theme) => ({
  TextField: {
    width: '100%',
  },
}));

type PropsType = {
  name: string;
} & Omit<TextFieldProps, 'name' | 'value' | 'variant'>;

export const FTextField = ({ name, InputProps, ...props }: PropsType) => {
  const [field, meta] = useField(name);
  const classes = useStyles();

  return (
    <TextField
      {...field}
      variant="outlined"
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error ? meta.error : null}
      className={classes.TextField}
      InputProps={{
        // classes: {input: classes.resize},
        ...InputProps,
        // endAdornment: (
        //   <>
        //     {meta.error && meta.touched && (
        //       <InputAdornment position="end" component="span">
        //         {/* <ErrorIcon fill="#C60C30" /> */}
        //       </InputAdornment>
        //     )}

        //     {InputProps?.endAdornment}
        //   </>
        // ),
      }}
      {...props}
    />
  );
};
