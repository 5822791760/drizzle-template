import { Single } from '@core/interfaces/response.interfaces';
import { UsersUsecaseFindAll } from '@app/modules/users/usecase/users.usecase.type';

export class FindAllUserHttpResponse implements Single<UsersUsecaseFindAll> {
  id: number;
  name: string;
}
