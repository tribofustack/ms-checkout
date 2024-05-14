import {
  closeDatabase,
  initDatabase,
} from 'src/external/infra/database/sequelize';
import { IOrderRepository } from 'src/internal/domain/checkout/repositories/order.repository';

import { OrderSequelizeRepository } from './order-sequelize.repository';
import { OrderModel } from './order-model';
import { OrderItemModel } from './order-item-model';

let orderModel: typeof OrderModel;
let orderItemModel: typeof OrderItemModel;
let repository: IOrderRepository;

describe('Order Sequelize Repository', () => {
  beforeAll(async () => {
    await initDatabase();
    orderModel = OrderModel;
    orderItemModel = OrderItemModel
    repository = new OrderSequelizeRepository(orderModel, orderItemModel);
  });
  afterAll(async () => closeDatabase());

  describe('getStatus', () => {
    it('should get order status by id', async () => {
      // arrange
      const customerId = 'abcd-efgh-ijkl-mno';
      const orderId = 'abcd-efgh-ijkl';
      const orderItemId = 'abcd-efgh-ijkl-item';
      const productId = 'abcd-efgh-ijkl-product';

      const orderStatus = 'Pendente de pagamento';

      await orderModel.create({
        id: orderId,
        customerId: customerId,
        status: orderStatus,
        total: 100,
      });
      await orderItemModel.create({
        id: orderItemId,
        orderId: orderId,
        productId: productId,
        value: 100,
        quantity: 1,
      });

      // act
      const getOrderStatus = await repository.getStatus(orderId);

      // assert
      expect(getOrderStatus).not.toBeUndefined();
      expect(getOrderStatus.status).toBe(orderStatus);
    });
  });
});
