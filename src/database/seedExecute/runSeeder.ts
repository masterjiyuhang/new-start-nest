import { dataSource } from 'src/common/config/ormconfig';
import { runSeeders } from 'typeorm-extension';

(async () => {
  await dataSource.initialize();

  await runSeeders(dataSource);
  console.log('Database seeding completed successfully.');
})();
