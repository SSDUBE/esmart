import { lazy } from 'react';
import {
  Speed as SpeedIcon,
  PeopleAlt as PeopleAltIcon,
  Build as BuildIcon,
} from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import { AppDrawer } from '../components/AppDrawer';
import { BitManagment } from '../views/BitManagment';
import { Dashboard } from '../views/Dashboard';
import { UserManagement } from '../views/UserManagement';

interface IBaseRoute {
  path: string;
  Component: any;
}

export interface IRoute {
  paths: string[];
  Component: any;
  Icon?: any;
  name: string;
}

interface IRouteItem {
  base: IBaseRoute;
  routes: IRoute[];
}

interface IRouteItems {
  [key: string]: IRouteItem;
}

const Signin = lazy(() => import('../views/Signin'));
const Signup = lazy(() => import('../views/Signup'));

export const RouteItems: IRouteItems = {
  open: {
    base: {
      path: '/',
      Component: null,
    },
    routes: [
      {
        paths: ['/signin'],
        Component: Signin,
        name: 'Signin',
      },
      {
        paths: ['/signup'],
        Component: Signup,
        name: 'Signup',
      },
    ],
  },
  restricted: {
    base: {
      path: '/',
      Component: (
        <AppDrawer>
          <Outlet />
        </AppDrawer>
      ),
    },
    routes: [
      {
        paths: ['/dashboard', '/'],
        Component: Dashboard,
        Icon: SpeedIcon,
        name: 'Dashboard',
      },
      {
        paths: ['/user-management'],
        Component: UserManagement,
        Icon: PeopleAltIcon,
        name: 'User Management',
      },
      {
        paths: ['/bit-management'],
        Component: BitManagment,
        Icon: BuildIcon,
        name: 'Bit Management',
      },
    ],
  },
};
