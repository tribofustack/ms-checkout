import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { OrderItemModel } from 'src/external/adapters/checkout/sequelize/order-item-model';
import { OrderModel } from 'src/external/adapters/checkout/sequelize/order-model';
import { DatabaseException } from 'src/external/infra/errors/database.error';

import { connection } from './connections';

export const sequelizeModels = [
  OrderModel,
  OrderItemModel,
];

export const sequelizeModule = SequelizeModule.forRoot({
  ...connection,
  models: sequelizeModels,
} as SequelizeModuleOptions);

let sequelize: Sequelize | null;

export const initDatabase = async () => {
  sequelize = new Sequelize(connection as SequelizeModuleOptions);

  await sequelize.authenticate({ logging: false });

  sequelize.addModels(sequelizeModels);
  await sequelize.sync({ force: true });

  return sequelize;
};

export const closeDatabase = async (): Promise<void> => {
  if (!sequelize) {
    throw new DatabaseException('Sequelize connection not exists.');
  }

  await sequelize.close();
  sequelize = null;
};
