import { FunctionComponent } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { MuiModal } from './MuiModal';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

interface IProps {
  title: string;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmation: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  yesButton: {
    width: theme.spacing(2),
    height: theme.spacing(3),
    fontSize: 11,
  },
  cancelButton: {
    width: theme.spacing(2),
    height: theme.spacing(3),
    fontSize: 11,
    background: 'rgb(207, 213, 227)',
    marginLeft: theme.spacing(1),
    color: '#000',
  },
}));

export const ConfirmiationModal: FunctionComponent<IProps> = ({
  showModal,
  setShowModal,
  title,
  handleConfirmation,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <MuiModal
      open={showModal}
      setOnClose={() => setShowModal(false)}
      customStyle={{ width: theme.spacing(50), padding: theme.spacing(5) }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Box display="flex" alignItems="center">
          <ErrorOutlineIcon
            style={{
              color: theme.palette.primary.light,
              marginRight: theme.spacing(1.5),
            }}
          />
          <Typography>{title}</Typography>
        </Box>
        <Box
          width="100%"
          display="flex"
          justifyContent="flex-end"
          marginTop={theme.spacing(2.5)}
        >
          <Button className={classes.yesButton} onClick={handleConfirmation}>Yes</Button>
          <Button className={classes.cancelButton} onClick={() => setShowModal(false)}>Cancel</Button>
        </Box>
      </Box>
    </MuiModal>
  );
};