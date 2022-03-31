import { Config } from '../utilities/Config';
import { Helpers } from '../utilities/Helpers';
import { SecureService } from './SecureService';

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
}
