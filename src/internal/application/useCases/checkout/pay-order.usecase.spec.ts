import { Test, TestingModule } from '@nestjs/testing';
import { PayOrder } from './pay-order.usecase';
import { IOrderRepository } from 'src/internal/domain/checkout/repositories/order.repository';
import { IEventEmitter } from '../../ports/events/event';
import { NotFoundException } from '@nestjs/common';
import { DomainException } from 'src/internal/application/errors';
import { ChangedOrderStatusEvent } from 'src/internal/domain/checkout/events/order-status-changed.event';
import { Order } from 'src/internal/domain/checkout/entities/order.entity';
import { OrderItem } from 'src/internal/domain/checkout/entities/order-item.entity';


describe('PayOrder', () => {
  let payOrder: PayOrder;
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
        PayOrder,
        { provide: 'OrderRepository', useValue: orderRepositoryMock },
        { provide: 'EventEmitter', useValue: eventEmitterMock },
      ],
    }).compile();

    payOrder = module.get<PayOrder>(PayOrder);
  });

  describe('execute', () => {
    it('should emit order-status.changed event if payment is valid', async () => {
      const payment = {
        orderId: 'testOrderId',
        paymentId: 'paymentId',
        status: 'Pendente de pagamento',
      };
      const order = new Order({
        id: 'testOrderId',
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
      order.status = 'Recebido';

      orderRepositoryMock.findOne.mockResolvedValue(order);

      await payOrder.execute(payment);

      expect(orderRepositoryMock.findOne).toHaveBeenCalledWith(payment.orderId);
      expect(eventEmitterMock.emit).toHaveBeenCalledWith(
        'order-status.changed',
        new ChangedOrderStatusEvent({
          orderId: order.id,
          status: 'Pendente de pagamento',
        }),
      );
    });

    it('should throw NotFoundException if the order does not exist', async () => {
      const payment = {
        orderId: 'nonExistentOrderId',
        paymentId: 'paymentId',
        status: 'Pendente de pagamento',
      };

      orderRepositoryMock.findOne.mockResolvedValue(null);

      await expect(payOrder.execute(payment)).rejects.toThrow(NotFoundException);
      expect(orderRepositoryMock.findOne).toHaveBeenCalledWith(payment.orderId);
    });
  });
});
