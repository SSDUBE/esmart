import React, { FunctionComponent } from 'react';
// import { UserService } from '../services/UserService';

interface IAppProvider {}

export const AppContext = React.createContext('App');

export const AppProvider: FunctionComponent<IAppProvider> = ({ children }) => {
  const [state, setState] = React.useState({
    global: {
      user: {
        isLogin: false,
        active: true,
        firstName: '',
        lastName: '',
        createdAt: '',
        email: '',
        idNumber: '',
        roleType: null,
        schoolId: null,
        schoolName: '',
        contactNumber: '',
        classId: '',
        channelName: '',
        location: {},
      },
    },
    user: {
      update: async (data: any) => {
        if (data) {
          const newUser = {
            active: true,
            isLogin: true,
            firstName: data.firstName,
            lastName: data.lastName,
            createdAt: data.createdAt,
            email: data.email,
            idNumber: data.idNumber,
            roleType: data.roleType,
            contactNumber: data.contactNumber,
            schoolId: data.schoolID,
            schoolName: data.schoolName ? data.schoolName : null,
            classId: data.classID,
            channelName: data.channelName,
          };
          const contextParams = { ...state.global };
          const updateUser = Object.assign(contextParams.user, newUser);

          updateGlobal({ user: updateUser });
        }
      },
      updateLocation: async (data: any) => {
        if (data) {
          const contextParams = { ...state.global };
          const updateUser = Object.assign({}, contextParams.user, {
            location: data,
          });
          updateGlobal({ user: updateUser });
        }
      },
    },
  });

  // React.useEffect(() => {
  //   async function getUserProfile() {
  //     const tempUserService = new UserService();
  //     const user = await tempUserService.get();
  //     state.user.update(user.data);
  //   }

  //   getUserProfile();
  // }, [state.user]);

  const updateGlobal = (params: any) => {
    const contextParams: any = state.global;
    Object.assign(contextParams, params);
    const newState = Object.assign({}, contextParams.global, state);
    setState({ ...newState });
  };

  // @ts-ignore
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};
