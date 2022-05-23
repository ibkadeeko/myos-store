import { Factory, Seeder } from 'typeorm-seeding';

import { Product } from '../../entities';

export default class SeedProducts implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(Product)().createMany(10);
  }
}
