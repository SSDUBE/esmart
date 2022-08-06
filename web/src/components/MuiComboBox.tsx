import { FunctionComponent } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box } from '@mui/system';
import { Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

interface IProps {
  label: string;
  data: any[];
  handleChange: any;
  error: string | undefined;
  defaultValue?: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  error: {
    color: '#d32f2f',
    fontSize: theme.spacing(1.7),
    fontWeight: '400',
    lineHeight: 1.66,
  },
}));

export const ComboBox: FunctionComponent<IProps> = ({
  label,
  data,
  handleChange,
  error,
  defaultValue,
}) => {
  const classes = useStyles();

  return (
    <Box>
      <Autocomplete
        disableClearable
        onChange={handleChange}
        disablePortal
        options={data}
        defaultValue={defaultValue}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
      {error && <Typography className={classes.error}>{error}</Typography>}
    </Box>
  );
};
