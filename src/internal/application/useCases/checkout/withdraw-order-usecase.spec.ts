import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, Inject } from '@nestjs/common';
import { WithdrawnOrder } from './withdraw-order-usecase';
import { IOrderRepository } from 'src/internal/domain/checkout/repositories/order.repository';
import { DomainException } from 'src/internal/application/errors';
import { ChangedOrderStatusEvent } from 'src/internal/domain/checkout/events/order-status-changed.event';
import { IEventEmitter } from '../../ports/events/event';
import { Order } from 'src/internal/domain/checkout/entities/order.entity';
import { OrderItem } from 'src/internal/domain/checkout/entities/order-item.entity';

describe('WithdrawnOrder', () => {
  let withdrawnOrder: WithdrawnOrder;
  let orderRepositoryMock: jest.Mocked<IOrderRepository>;
  let eventEmitterMock: jest.Mocked<IEventEmitter>;

  beforeAll(async () => {
    orderRepositoryMock = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<IOrderRepository>;

    eventEmitterMock = {
      emit: jest.fn(),
    } as unknown as jest.Mocked<IEventEmitter>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawnOrder,
        { provide: 'OrderRepository', useValue: orderRepositoryMock },
        { provide: 'EventEmitter', useValue: eventEmitterMock },
      ],
    }).compile();

    withdrawnOrder = module.get<WithdrawnOrder>(WithdrawnOrder);
  });

  describe('execute', () => {
    it('should withdraw the order and emit events', async () => {
      const orderId = 'testOrderId';
      const order = new Order({
        id: orderId,
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
      });
      order.status = 'Pronto';

      orderRepositoryMock.findOne.mockResolvedValue(order);

      await withdrawnOrder.execute(orderId);

      expect(eventEmitterMock.emit).toHaveBeenCalledWith(
        'order-status.changed',
        expect.any(ChangedOrderStatusEvent),
      );
    });

    it('should throw NotFoundException if the order does not exist', async () => {
      const orderId = 'nonExistentOrderId';

      orderRepositoryMock.findOne.mockResolvedValue(null);

      await expect(withdrawnOrder.execute(orderId)).rejects.toThrow(NotFoundException);
    });

    it('should throw DomainException if order status is invalid', async () => {
      const orderId = 'testOrderId';
      const order = new Order({
        id: orderId,
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
      });

      orderRepositoryMock.findOne.mockResolvedValue(order);

      await expect(withdrawnOrder.execute(orderId)).rejects.toThrow(DomainException);
    });
  });
});
