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
  closeModal: () => void;
  handleConfirmation: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  yesButton: {
    width: theme.spacing(1),
    height: theme.spacing(2),
    fontSize: 11,
  },
  cancelButton: {
    width: theme.spacing(1),
    height: theme.spacing(1),
    fontSize: 11,
    background: 'rgb(207, 213, 227)',
    marginLeft: theme.spacing(1),
    color: '#000',
  },
}));

export const ConfirmiationModal: FunctionComponent<IProps> = ({
  showModal,
  closeModal,
  title,
  handleConfirmation,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <MuiModal
      open={showModal}
      setOnClose={closeModal}
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
          <Button
            style={{
              width: theme.spacing(3),
              height: theme.spacing(3),
              fontSize: 11,
            }}
            onClick={handleConfirmation}
          >
            Yes
          </Button>
          <Button
            style={{
              width: theme.spacing(3),
              height: theme.spacing(3),
              fontSize: 11,
              background: 'rgb(207, 213, 227)',
              marginLeft: theme.spacing(1),
              color: '#000',
            }}
            onClick={closeModal}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </MuiModal>
  );
};
