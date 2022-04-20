import React, { FunctionComponent } from 'react';
import { UserService } from '../services/UserService';

interface IAppProvider {}

export const AppContext = React.createContext('App');

export const AppProvider: FunctionComponent<IAppProvider> = ({ children }) => {
  const [state, setState] = React.useState({
    global: {
      user: {
        isLogin: false,
        active: true,
        firstName: null,
        lastName: null,
        createdAt: null,
        email: null,
        idNumber: null,
        roleId: null,
        roleName: null,
        schoolId: null,
        schoolName: null,
        _id: null,
      },
    },
    user: {
      update: async (data: any) => {
        if (data) {
          const newUser = {
            active: true,
            isLogin: true,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            createdAt: data.user.createdAt,
            email: data.user.email,
            idNumber: data.user.id_number,
            roleId: data.user.roleId,
            roleName: data.role,
            schoolId: data.user.schoolId,
            schoolName: data.school.name,
            _id: data.user._id,
          };
          const contextParams = { ...state.global };
          const updateUser = Object.assign({}, contextParams.user, newUser);

          updateGlobal({ user: updateUser });
        }
      },
    },
  });

  React.useEffect(() => {
    async function getUserProfile() {
      const tempUserService = new UserService()
      const user = await tempUserService.get()
      state.user.update(user.data)
    }

    getUserProfile()
  }, [state.user]);

  const updateGlobal = (params: any) => {
    const contextParams: any = state.global;
    Object.assign(contextParams, params);
    const newState = Object.assign({}, contextParams.global, state);
    setState({ ...newState });
  };

  // @ts-ignore
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};
