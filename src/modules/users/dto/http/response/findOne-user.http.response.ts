import { UsersUsecaseFindOne } from '../../../user.type';

export class FindOneUserHttpResponse implements UsersUsecaseFindOne {
  id: number;
  name: string;
  city: { id: number; name: string };
}
