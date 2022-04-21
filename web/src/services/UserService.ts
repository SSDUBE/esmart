import { Config } from '../utilities/Config';
import { Helpers } from '../utilities/Helpers';
import { SecureService } from './SecureService';

interface INewUser {
  firstname: String;
  idNumber: String;
  lastname: String;
  password: String;
  roleType: String;
  roleId: String;
  schoolId: String;
  schoolName: String;
  grade?: number;
  gradeId?: String;
}

export class UserService extends SecureService {
  public get = async () => {
    try {
      const response = await fetch(Config.services.user.get, {
        method: 'GET',
        headers: {
          ...this.defaultHeaders,
          Authorization: `Basic ${await Helpers.getInStorage('token')}`,
        },
      });

      return response.json();
    } catch (err: any) {
      throw new Error(err);
    }
  };

  public getAllUsers = async (userId: string, schoolId?: string) => {
    try {
      const response = await fetch(
        Config.services.user.all.replace(':userId', userId),
        {
          method: 'POST',
          headers: {
            ...this.defaultHeaders,
            Authorization: `Basic ${await Helpers.getInStorage('token')}`,
          },
          body: JSON.stringify({ schoolId }),
        }
      );

      return response.json();
    } catch (err: any) {
      throw new Error(err);
    }
  };

  public getRoles = async () => {
    try {
      const response = await fetch(Config.services.user.roles, {
        method: 'GET',
        headers: {
          ...this.defaultHeaders,
          Authorization: `Basic ${await Helpers.getInStorage('token')}`,
        },
      });

      return response.json();
    } catch (err: any) {
      throw new Error(err);
    }
  };

  public getGrades = async () => {
    try {
      const response = await fetch(Config.services.user.grades, {
        method: 'GET',
        headers: {
          ...this.defaultHeaders,
          Authorization: `Basic ${await Helpers.getInStorage('token')}`,
        },
      });

      return response.json();
    } catch (err: any) {
      throw new Error(err);
    }
  };

  public addNewUser = async (user: INewUser) => {
    try {
      const response = await fetch(Config.services.user.addNewUser, {
        method: 'Post',
        headers: {
          ...this.defaultHeaders,
          Authorization: `Basic ${await Helpers.getInStorage('token')}`,
        },
        body: JSON.stringify(user),
      });

      return response.json();
    } catch (err: any) {
      throw new Error(err);
    }
  };

  public deleteUser = async (idNumber: string) => {
    try {
      const response = await fetch(
        Config.services.user.delete.replace(':idNumber', idNumber),
        {
          method: 'DELETE',
          headers: {
            ...this.defaultHeaders,
            Authorization: `Basic ${await Helpers.getInStorage('token')}`,
          },
        }
      );

      return response.json();
    } catch (err: any) {
      throw new Error(err);
    }
  };

  public updateUser = async (data: any) => {
    try {
      const response = await fetch(Config.services.user.update, {
        method: 'PUT',
        headers: {
          ...this.defaultHeaders,
          Authorization: `Basic ${await Helpers.getInStorage('token')}`,
        },
        body: JSON.stringify({ ...data }),
      });

      return response.json();
    } catch (err: any) {
      throw new Error(err);
    }
  };
}
