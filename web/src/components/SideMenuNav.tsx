import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { RouteItems, IRoute } from '../constants';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../context/context';

interface ISideMenuNavLinkProps {
  routeName: string;
  paths: string[];
  Icon: any;
}

const SideMenuNavLink = (props: ISideMenuNavLinkProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPathName, setCurrentPathName] = React.useState(location.pathname);

  const getStyles = (paths: string[]) => {
    return paths.includes(currentPathName)
      ? { backgroundColor: theme.palette.primary.light }
      : undefined;
  };

  React.useEffect(() => {
    setCurrentPathName(location.pathname);
  }, [location.pathname]);

  return (
    <ListItem
      button
      key={props.routeName}
      style={getStyles(props.paths)}
      onClick={() => navigate(props.paths[0])}
    >
      <ListItemIcon>
        <props.Icon style={{ color: theme.palette.common.white }} />
      </ListItemIcon>
      <ListItemText primary={props.routeName} />
    </ListItem>
  );
};

export const SideMenuNav = () => {
  const context: any = React.useContext(AppContext);

  return (
    <List>
      {RouteItems.restricted.routes.map((item: IRoute) => (
        item.roles?.includes(context.global.user.roleName) &&<SideMenuNavLink
          key={item.name}
          routeName={item.name}
          paths={item.paths}
          Icon={item.Icon}
        />
      ))}
    </List>
  );
};
