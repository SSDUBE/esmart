import { Config } from '../utilities/Config';
import { SecureService } from './SecureService';

interface IUserSignUp {
  idNumber: string;
  email: string;
  password: string;
  schoolName: string;
}

interface IUserSignIn {
  idNumber: string;
  password: string;
}

export class AuthService extends SecureService {
  public signinUser = async (user: IUserSignIn) => {
    try {
      const response = await fetch(Config.services.user.signin, {
        method: 'POST',
        headers: {
          ...this.defaultHeaders,
          Authorization: `Basic ${btoa(`${user.idNumber}:${user.password}`)}`,
        },
      });

      return response.json();
    } catch (err: any) {
      throw new Error(err)
    }
  };
}
