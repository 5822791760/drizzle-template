import { EventEntity } from '../../../../../core/ddd/event-entity.base';
import { InsertUSERS } from '../../../../drizzle/schema.type';
import { UserEntityProps } from './user.entity.type';

export class UserEntity extends EventEntity<UserEntityProps> {
  public validate() {
    return null;
  }

  create(createData: UserEntityProps) {
    const props = createData;
    return new UserEntity({ props });
  }

  toDbValues(): InsertUSERS {
    const props = this.getProps();
    return {
      name: props.name,
      cityId: props.cityId || null,
    };
  }
}
