import { DomainEvent, DomainEventProps } from '@core/ddd/domain-event.base';

export class UserCreatedDomainEvent extends DomainEvent {
  readonly name: string;

  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props);
    this.name = props.name;
  }
}
