import { Test, TestingModule } from '@nestjs/testing';
import { GetOrderStatus } from './get-order-status.usecase';
import { IOrderRepository } from 'src/internal/domain/checkout/repositories/order.repository';
import { NotFoundException } from '@nestjs/common';
import { Order } from 'src/internal/domain/checkout/entities/order.entity';
import { OrderItem } from 'src/internal/domain/checkout/entities/order-item.entity';

describe('GetOrderStatus', () => {
  let getOrderStatus: GetOrderStatus;
  let orderRepositoryMock: jest.Mocked<IOrderRepository>;

  beforeAll(async () => {
    orderRepositoryMock = {
      findOne: jest.fn(),
      getStatus: jest.fn(),
    } as unknown as jest.Mocked<IOrderRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOrderStatus,
        { provide: 'OrderRepository', useValue: orderRepositoryMock },
      ],
    }).compile();

    getOrderStatus = module.get<GetOrderStatus>(GetOrderStatus);
  });

  describe('execute', () => {
    it('should return the order status and time to wait', async () => {
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
      const statusResponse = { status: 'Aprovado' };

      orderRepositoryMock.findOne.mockResolvedValue(order);
      orderRepositoryMock.getStatus.mockResolvedValue(statusResponse);

      const result = await getOrderStatus.execute(orderId);

      expect(result).toEqual({
        status: 'Aprovado',
        timeToWait: 'Tempo de espera: 45 minutos.',
      });
      expect(orderRepositoryMock.findOne).toHaveBeenCalledWith(orderId);
      expect(orderRepositoryMock.getStatus).toHaveBeenCalledWith(orderId);
    });

    it('should throw NotFoundException if the order does not exist', async () => {
      const orderId = 'nonExistentOrderId';

      orderRepositoryMock.findOne.mockResolvedValue(null);

      // const notFoundException = new NotFoundException('Order not found');
      await expect(getOrderStatus.execute(orderId)).rejects.toThrow(NotFoundException);
      expect(orderRepositoryMock.findOne).toHaveBeenCalledWith(orderId);
    });

    it('should handle different statuses correctly', async () => {
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

      const statuses = [
        { status: 'Aprovado', expectedTime: 'Tempo de espera: 45 minutos.' },
        { status: 'Em preparação', expectedTime: 'Tempo de espera: 30 minutos.' },
        { status: 'Pronto', expectedTime: 'Pedido pronto para retirar.' },
        { status: 'Finalizado', expectedTime: 'Pedido foi retirado e finalizado.' },
      ];

      orderRepositoryMock.findOne.mockResolvedValue(order);

      for (const { status, expectedTime } of statuses) {
        orderRepositoryMock.getStatus.mockResolvedValue({ status });

        const result = await getOrderStatus.execute(orderId);

        expect(result).toEqual({
          status,
          timeToWait: expectedTime,
        });
      }
    });

    it('should return default message if status is not recognized', async () => {
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
      const statusResponse = { status: 'Unknown' };

      orderRepositoryMock.findOne.mockResolvedValue(order);
      orderRepositoryMock.getStatus.mockResolvedValue(statusResponse);

      const result = await getOrderStatus.execute(orderId);

      expect(result).toEqual({
        status: 'Unknown',
        timeToWait: 'Pedido ainda não foi iniciado.',
      });
    });
  });
});
