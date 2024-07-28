import { UsersUsecaseFindOne } from '@app/modules/users/usecase/users.usecase.type';

export class FindOneUserHttpResponse implements UsersUsecaseFindOne {
  id: number;
  name: string;
  city: { id: number; name: string };
}
