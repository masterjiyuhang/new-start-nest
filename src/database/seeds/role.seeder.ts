import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from '../../core/role/entities/role.entity';

export default class UserSeeder implements Seeder {
  track = false;
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const roleRepository = dataSource.getRepository(Role);

    const roles = [
      { name: 'SuperAdmin', code: '1', desc: 'Super Administrator' },
      { name: 'Admin', code: '2', desc: 'System Administrator' },
      { name: 'User', code: '3', desc: 'Content User' },
      { name: 'Viewer', code: '4', desc: 'Content Viewer' },
    ];
    // await roleRepository.insert();

    for (const role of roles) {
      const exists = await roleRepository.findOneBy({ code: role.code });
      if (!exists) {
        await roleRepository.save(role);
      }
    }

    // ---------------------------------------------------

    const roleFactory = factoryManager.get(Role);
    console.log(
      '🍉 ~ file: role.seeder.ts:20 ~ UserSeeder ~ roleFactory:',
      roleFactory,
    );

    this.track = true;
    // // save 1 factory generated entity, to the database
    // await roleFactory.save();

    // // save 5 factory generated entities, to the database
    // await roleFactory.saveMany(5);
  }
}
