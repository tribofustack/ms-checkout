import { closeDatabase, initDatabase } from 'src/external/infra/database/sequelize';
import { IOrderRepository } from 'src/internal/domain/checkout/repositories/order.repository';

import { OrderSequelizeRepository } from './order-sequelize.repository';
import { OrderModel } from './order-model';
import { OrderItemModel } from './order-item-model';

import { Order } from 'src/internal/domain/checkout/entities/order.entity';
import { OrderItem } from 'src/internal/domain/checkout/entities/order-item.entity';

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
      const customerId = 'getStatus-abcd-efgh-ijkl-mno';
      const orderId = 'getStatus-abcd-efgh-ijkl';
      const orderItemId = 'getStatus-abcd-efgh-ijkl-item';
      const productId = 'getStatus-abcd-efgh-ijkl-product';

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
      const order = await repository.getStatus(orderId);

      // assert
      expect(order).not.toBeUndefined();
      expect(order).not.toBeNull();
      expect(order.status).toBe(orderStatus);
    });
  });

  describe('getReportByCustomer', () => {
    it('should get report  by customerId', async () => {
      // arrange
      const customerId = 'getReportByCustomer-abcd-efgh-ijkl-mno';
      const orderId = 'getReportByCustomer-abcd-efgh-ijkl';
      const orderItemId = 'getReportByCustomer-abcd-efgh-ijkl-item';
      const productId = 'getReportByCustomer-abcd-efgh-ijkl-product';

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
      const totalReport = await repository.getReportByCustomer(customerId);

      // assert
      expect(totalReport).not.toBeUndefined();
      expect(totalReport).not.toBeNull();
      expect(totalReport.purchases).toBe(1);
      expect(totalReport.value).toBe(100);
    });
  });

  describe('changeStatus', () => {
    it('should change order status', async () => {
      // arrange
      const customerId = 'changeStatus-abcd-efgh-ijkl-mno';
      const orderId = 'changeStatus-abcd-efgh-ijkl';
      const orderItemId = 'changeStatus-abcd-efgh-ijkl-item';
      const productId = 'changeStatus-abcd-efgh-ijkl-product';

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
      await repository.changeStatus(orderId, 'Pago');
      const order = await repository.getStatus(orderId);

      // assert
      expect(order).not.toBeUndefined();
      expect(order).not.toBeNull();
      expect(order.status).toBe('Pago');
    });
  });

  describe('findOne', () => {
    it('should get order by orderId', async () => {
      // arrange
      const customerId = 'findOne-abcd-efgh-ijkl-mno';
      const orderId = 'findOne-abcd-efgh-ijkl';
      const orderItemId = 'findOne-abcd-efgh-ijkl-item';
      const productId = 'findOne-abcd-efgh-ijkl-product';

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
      const order = await repository.findOne(orderId);

      // assert
      expect(order).not.toBeUndefined();
      expect(order).not.toBeNull();
      expect(order.orderItems).not.toBeUndefined();
      expect(order.orderItems).not.toBeNull();
    });
  });

  describe('findAll', () => {
    it('should get all orders', async () => {
      // arrange
      const customerId = 'findAll-abcd-efgh-ijkl-mno';
      const orderId = 'findAll-abcd-efgh-ijkl';
      const orderItemId = 'findAll-abcd-efgh-ijkl-item';
      const productId = 'findAll-abcd-efgh-ijkl-product';

      const orderStatus = 'Pendente de pagamento';

      await orderModel.create({
        id: orderId + '1',
        customerId: customerId,
        status: orderStatus,
        total: 100,
      });

      await orderItemModel.create({
        id: orderItemId + '1',
        orderId: orderId + '1',
        productId: productId,
        value: 100,
        quantity: 1,
      });

      await orderModel.create({
        id: orderId + '2',
        customerId: customerId,
        status: 'Finalizado',
        total: 100,
      });

      await orderItemModel.create({
        id: orderItemId + '2',
        orderId: orderId + '2',
        productId: productId,
        value: 100,
        quantity: 1,
      });

      // act
      const orders: Order[] = await repository.findAll(customerId);

      // assert
      expect(orders.length).toBe(2);
    });
  });

  describe('findAllWithoutFinishedAndOrderedByStatusAndCreateDate', () => {
    it('should find all orders without finished and ordered by status and create date', async () => {
      // arrange
      const customerId = 'abcd-efgh-ijkl-mno';
      const orderId = 'abcd-efgh-ijkl';
      const orderItemId = 'abcd-efgh-ijkl-item';
      const productId = 'abcd-efgh-ijkl-product';

      await orderModel.create({
        id: orderId + '1',
        customerId: customerId,
        status: 'Pendente de pagamento',
        total: 100,
      });

      await orderItemModel.create({
        id: orderItemId + '1',
        orderId: orderId + '1',
        productId: productId,
        value: 100,
        quantity: 1,
      });

      await orderModel.create({
        id: orderId + '2',
        customerId: customerId,
        status: 'Finalizado',
        total: 100,
      });

      await orderItemModel.create({
        id: orderItemId + '2',
        orderId: orderId + '2',
        productId: productId,
        value: 100,
        quantity: 1,
      });

      // act
      const orders: Order[] = await repository.findAllWithoutFinishedAndOrderedByStatusAndCreateDate(customerId);

      // assert
      expect(orders.length).toBe(1);
    });
  });

  describe('create', () => {
    it('should create an order', async () => {
      // arrange
      const customerId = 'create-abcd-efgh-ijkl-mno';
      const orderId = 'create-abcd-efgh-ijkl';
      const orderItemId = 'create-abcd-efgh-ijkl-item';
      const productId = 'create-bcd-efgh-ijkl-product';

      const orderItem = new OrderItem({
        id: orderItemId,
        productId: productId,
        value: 10,
        quantity: 1,
      });

      let orderEntity: Order = new Order({
        id: orderId,
        customerId: customerId,
        orderItems: [orderItem],
      });

      // act
      await repository.create(orderEntity);
      const order = await repository.findOne(orderId);

      // assert
      expect(order).not.toBeUndefined();
      expect(order).not.toBeNull();
      expect(order.orderItems.length).toBe(1);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      // arrange
      const customerId = 'update-abcd-efgh-ijkl-mno';
      const orderId = 'update-abcd-efgh-ijkl';
      const orderItemId = 'update-abcd-efgh-ijkl-item';
      const productId = 'update-abcd-efgh-ijkl-product';

      await orderModel.create({
        id: orderId,
        customerId: customerId,
        status: 'Recebido',
        total: 100,
      });
      await orderItemModel.create({
        id: orderItemId,
        orderId: orderId,
        productId: productId,
        value: 100,
        quantity: 1,
      });

      let orderEntity = await repository.findOne(orderId);
      orderEntity.customerId = customerId + '2';

      // act
      await repository.update(orderId, orderEntity);
      const orderEntityUpdated = await repository.findOne(orderId);

      // assert
      expect(orderEntityUpdated).not.toBeUndefined();
      expect(orderEntityUpdated).not.toBeNull();
      expect(orderEntityUpdated.customerId).toBe(customerId + '2');
    });
  });

  describe('delete', () => {
    it('should delete an order', async () => {
      // arrange
      const customerId = 'delete-abcd-efgh-ijkl-mno';
      const orderId = 'delete-abcd-efgh-ijkl';
      const orderItemId = 'delete-abcd-efgh-ijkl-item';
      const productId = 'delete-abcd-efgh-ijkl-product';

      await orderModel.create({
        id: orderId,
        customerId: customerId,
        status: 'Recebido',
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
      await repository.delete(orderId);
      const orderEntity = await repository.findOne(orderId);

      // assert
      expect(orderEntity).toBeNull();
    });
  });
});
