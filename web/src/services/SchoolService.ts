import { Config } from '../utilities/Config';
import { Helpers } from '../utilities/Helpers';
import { SecureService } from './SecureService';

export class SchoolService extends SecureService {
  public all = async () => {
    try {
      const response = await fetch(Config.services.school.all, {
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
