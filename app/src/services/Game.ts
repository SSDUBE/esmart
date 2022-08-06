import { Config } from '../utilities/Config';
import { Helpers } from '../utilities/Helpers';
import { SecureService } from './SecureService';

interface IGamePoints {
  gameID: number;
  idNumber: string;
  answer: string;
}

export class GameService extends SecureService {
  public allocatePoints = async (game: IGamePoints) => {
    try {
      const helper = new Helpers();
      const token = await helper.getInStorage('token');
      const response = await fetch(Config.services.game.allocatePoints, {
        method: 'POST',
        headers: {
          ...this.defaultHeaders,
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify({ ...game }),
      });

      return response.json();
    } catch (err: any) {
      throw new Error(err);
    }
  };

  public getStudentPoints = async (idNumber: string) => {
    try {
      const helper = new Helpers();
      const token = await helper.getInStorage('token');
      const response = await fetch(
        Config.services.game.points.replace(':idNumber', idNumber),
        {
          method: 'GET',
          headers: {
            ...this.defaultHeaders,
            Authorization: `Basic ${token}`,
          },
        }
      );

      return response.json();
    } catch (err: any) {
      throw new Error(err);
    }
  };

  public suspendAccount = async (idNumber: string) => {
    try {
      const helper = new Helpers();
      const token = await helper.getInStorage('token');
      const response = await fetch(
        Config.services.game.suspend.replace(':idNumber', idNumber),
        {
          method: 'PUT',
          headers: {
            ...this.defaultHeaders,
            Authorization: `Basic ${token}`,
          },
        }
      );

      return response.json();
    } catch (err: any) {
      throw new Error(err);
    }
  };
}
