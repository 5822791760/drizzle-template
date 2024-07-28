import { Injectable } from '@nestjs/common';
import { UsersRepo } from '../repo/users.repo';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedDomainEvent } from '../../services/core/users/domain/event/user-created.domain-event';

@Injectable()
export class LogSomethingWhenUserCreatedDomainEventHandler {
  constructor(private readonly repo: UsersRepo) {}

  @OnEvent(UserCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: UserCreatedDomainEvent): Promise<any> {
    console.log('==================================');
    console.log(event);
    console.log('==================================');
  }
}
