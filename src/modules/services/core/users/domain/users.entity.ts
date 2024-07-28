import { EventEntity } from '../../../../../core/ddd/event-entity.base';
import { InsertUSERS } from '../../../../drizzle/schema.type';
import { UserCreatedDomainEvent } from './event/user-created.domain-event';
import { UserEntityProps } from './user.entity.type';

export class UserEntity extends EventEntity<UserEntityProps> {
  public validate() {
    return null;
  }

  static create(createData: UserEntityProps): UserEntity {
    const props = createData;
    props.cityId ||= null;

    const user = new UserEntity({ props });
    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: user.aggregateId,
        name: props.name,
      }),
    );
    return user;
  }

  toDbValues(): InsertUSERS {
    const props = this.getProps();
    return {
      name: props.name,
      cityId: props.cityId || null,
    };
  }
}
