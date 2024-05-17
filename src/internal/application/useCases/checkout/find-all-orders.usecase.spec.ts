import { Test, TestingModule } from '@nestjs/testing';
import { FindAllOrders } from './find-all-orders.usecase';
import { IOrderRepository } from 'src/internal/domain/checkout/repositories/order.repository';
import { Order } from 'src/internal/domain/checkout/entities/order.entity';
import { OrderItem } from 'src/internal/domain/checkout/entities/order-item.entity';

describe('FindAllOrders', () => {
  let findAllOrders: FindAllOrders;
  let orderRepositoryMock: jest.Mocked<IOrderRepository>;

  beforeAll(async () => {
    orderRepositoryMock = {
      findAllWithoutFinishedAndOrderedByStatusAndCreateDate: jest.fn(),
      // other repository methods if needed
    } as unknown as jest.Mocked<IOrderRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllOrders,
        { provide: 'OrderRepository', useValue: orderRepositoryMock },
      ],
    }).compile();

    findAllOrders = module.get<FindAllOrders>(FindAllOrders);
  });

  describe('execute', () => {
    it('should return all orders for a given customer and status', async () => {
      const customerId = 'testCustomerId';
      const status = 'pending';
      const orders = [
        new Order({
          id: 'orderId1',
          customerId: 'testCustomerId',
          orderItems: [
            new OrderItem({
              id: 'orderItemId1',
              productId: 'productId1',
              quantity: 2,
              value: 100,
            }),
          ],
          createdAt: new Date('2024-05-17T18:23:58.361Z'),
        }),
        new Order({
          id: 'orderId2',
          customerId: 'testCustomerId',
          orderItems: [
            new OrderItem({
              id: 'orderItemId2',
              productId: 'productId2',
              quantity: 1,
              value: 200,
            }),
          ],
          createdAt: new Date('2024-05-17T18:23:58.361Z'),
        }),
      ];

      orderRepositoryMock.findAllWithoutFinishedAndOrderedByStatusAndCreateDate.mockResolvedValue(orders);

      const result = await findAllOrders.execute(customerId, status);

      expect(result).toEqual({ orders });
      expect(orderRepositoryMock.findAllWithoutFinishedAndOrderedByStatusAndCreateDate).toHaveBeenCalledWith(customerId, status);
    });

    it('should return all orders regardless of customer and status if no parameters are provided', async () => {
      const orders = [
        new Order({
          id: 'orderId1',
          customerId: 'testCustomerId',
          orderItems: [
            new OrderItem({
              id: 'orderItemId1',
              productId: 'productId1',
              quantity: 2,
              value: 100,
            }),
          ],
          createdAt: new Date('2024-05-17T18:23:58.361Z'),
        }),
        new Order({
          id: 'orderId2',
          customerId: 'testCustomerId',
          orderItems: [
            new OrderItem({
              id: 'orderItemId2',
              productId: 'productId2',
              quantity: 1,
              value: 200,
            }),
          ],
          createdAt: new Date('2024-05-17T18:23:58.361Z'),
        }),
      ];

      orderRepositoryMock.findAllWithoutFinishedAndOrderedByStatusAndCreateDate.mockResolvedValue(orders);

      const result = await findAllOrders.execute();

      expect(result).toEqual({ orders });
      expect(orderRepositoryMock.findAllWithoutFinishedAndOrderedByStatusAndCreateDate).toHaveBeenCalledWith(undefined, undefined);
    });
  });
});
