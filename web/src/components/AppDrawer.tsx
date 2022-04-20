import React, { FunctionComponent } from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import { Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { SideMenuNav } from './SideMenuNav';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const drawerWidth = 240;

interface IProps {}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export const AppDrawer: FunctionComponent<IProps> = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box
      display="flex"
      sx={{ height: '100vh', background: 'rgb(248, 248, 255)' }}
    >
      <CssBaseline />
      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{ sx: { background: theme.palette.primary.main } }}
      >
        <DrawerHeader
          style={{
            display: 'flex',
            justifyContent: ' flex-start',
            marginLeft: 8,
          }}
        >
          {!open ? (
            <IconButton onClick={handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton onClick={handleDrawerClose} edge="start">
              <ChevronLeftIcon />
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <SideMenuNav />
      </Drawer>
      <Container maxWidth="lg" style={{ marginTop: 40 }}>
        {children}
      </Container>
    </Box>
  );
};
