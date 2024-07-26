import { Single } from '@core/interfaces/response.interfaces';
import { UsersUsecaseFindAll } from '../../../user.type';

export class FindAllUserHttpResponse implements Single<UsersUsecaseFindAll> {
  id: number;
  name: string;
}
