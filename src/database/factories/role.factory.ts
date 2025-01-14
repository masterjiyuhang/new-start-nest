import { Role } from '../../core/role/entities/role.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Role, (faker) => {
  const role = new Role();
  role.code = faker.string.nanoid();
  role.name = faker.person.firstName();
  role.desc = faker.person.lastName();

  return role;
});
