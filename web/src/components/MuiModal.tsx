import React, { FunctionComponent } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

const style = {
  borderRadius: '0.8em',
  boxShadow: 'rgb(0 0 0 / 8%) 0px 6px 15px 0px',
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  p: 7,
};

interface IProps {
  customStyle?: any;
  open: boolean;
  setOnClose: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MuiModal: FunctionComponent<IProps> = ({
  open,
  setOnClose,
  children,
  customStyle,
}) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => setOnClose(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style} style={customStyle ? customStyle : {}}>
          {children}
        </Box>
      </Fade>
    </Modal>
  );
};
