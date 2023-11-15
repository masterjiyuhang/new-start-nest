import {
  EntitySubscriberInterface,
  EventSubscriber,
  DataSource,
  InsertEvent,
} from 'typeorm';
import { User } from './entities/user.entity';

// Event subscribers can not be request-scoped!
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  beforeInsert(event: InsertEvent<User>) {
    console.log(`BEFORE USER INSERTED: `, event.entity);
  }
}
