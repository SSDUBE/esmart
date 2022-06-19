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

      console.log('game ', game)
      const helper = new Helpers();

      const response = await fetch(Config.services.game.allocatePoints, {
        method: 'POST',
        headers: {
          ...this.defaultHeaders,
          Authorization: `Basic ${await helper.getInStorage('token')}`,
        },
        body: JSON.stringify({ ...game }),
      });

      return response.json();
    } catch (err: any) {
      throw new Error(err);
    }
  };
}
