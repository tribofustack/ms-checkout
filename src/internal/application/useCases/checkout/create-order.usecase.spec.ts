import { Test, TestingModule } from "@nestjs/testing";
import { CreateOrder } from "./create-order.usecase";
import { CreateOrderDto } from "src/internal/domain/checkout/dto/create-order.dto";
import { IOrderRepository } from "src/internal/domain/checkout/repositories/order.repository";
import { IIdentifierGenerator } from "src/internal/application/ports/tokens/id-generator";
import { IEventEmitter } from "../../ports/events/event";
import { Order } from "src/internal/domain/checkout/entities/order.entity";
import { OrderItem } from "src/internal/domain/checkout/entities/order-item.entity";
import { CreatedOrderEvent } from "src/internal/domain/checkout/events/order-created.event";
import { ICheckinService } from "../../ports/integrations/checkin";

describe("CreateOrder", () => {
  let createOrder: CreateOrder;
  let idGeneratorMock: jest.Mocked<IIdentifierGenerator>;
  let orderRepositoryMock: jest.Mocked<IOrderRepository>;
  let eventEmitterMock: jest.Mocked<IEventEmitter>;
  let checkinServiceMock: jest.Mocked<ICheckinService>;

  beforeAll(async () => {
    idGeneratorMock = {
      generate: jest
        .fn()
        .mockReturnValue("a7a67b8e-5f28-4a3e-8a24-3f946918c2b6"),
    } as unknown as jest.Mocked<IIdentifierGenerator>;

    orderRepositoryMock = {
      create: jest.fn(),
      // other repository methods if needed
    } as unknown as jest.Mocked<IOrderRepository>;

    eventEmitterMock = {
      emit: jest.fn(),
      // other event emitter methods if needed
    } as unknown as jest.Mocked<IEventEmitter>;

    checkinServiceMock = {
      getCustomerById: jest.fn(),
      verifyProductQuantity: jest.fn(),
    } as unknown as jest.Mocked<ICheckinService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrder,
        { provide: "OrderRepository", useValue: orderRepositoryMock },
        { provide: "IdGenerator", useValue: idGeneratorMock },
        { provide: "EventEmitter", useValue: eventEmitterMock },
        { provide: "CheckinService", useValue: checkinServiceMock },
      ],
    }).compile();

    createOrder = module.get<CreateOrder>(CreateOrder);
  });

  describe("execute", () => {
    it("should create a new order", async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: "a7a67b8e-5f28-4a3e-8a24-3f946918c2b6",
        products: [
          {
            id: "a7a67b8e-5f28-4a3e-8a24-3f946918c2b6",
            quantity: 2,
            price: 100,
          },
          {
            id: "a7a67b8e-5f28-4a3e-8a24-3f946918c2b6",
            quantity: 1,
            price: 200,
          },
        ],
      };

      const expectedOrder = new Order({
        customerId: "a7a67b8e-5f28-4a3e-8a24-3f946918c2b6",
        id: "a7a67b8e-5f28-4a3e-8a24-3f946918c2b6",
        orderItems: [
          new OrderItem({
            id: "a7a67b8e-5f28-4a3e-8a24-3f946918c2b6",
            productId: "a7a67b8e-5f28-4a3e-8a24-3f946918c2b6",
            quantity: 2,
            value: 100,
          }),
          new OrderItem({
            id: "a7a67b8e-5f28-4a3e-8a24-3f946918c2b6",
            productId: "a7a67b8e-5f28-4a3e-8a24-3f946918c2b6",
            quantity: 1,
            value: 200,
          }),
        ],
      });
      expectedOrder.createdAt = new Date("2024-05-17T18:00:00.000Z");

      orderRepositoryMock.create.mockResolvedValue(expectedOrder);

      const result = await createOrder.execute(createOrderDto);
      result.createdAt = new Date("2024-05-17T18:00:00.000Z");

      expect(result).toEqual(expectedOrder);
      expect(orderRepositoryMock.create).toHaveBeenCalledWith(expectedOrder);
      expect(eventEmitterMock.emit).toHaveBeenCalledWith(
        "order.created",
        new CreatedOrderEvent(expectedOrder),
      );
    });
  });
});
