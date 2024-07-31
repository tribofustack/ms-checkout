import { Inject, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "src/internal/domain/checkout/dto/create-order.dto";
import { OrderItem } from "src/internal/domain/checkout/entities/order-item.entity";
import { Order } from "src/internal/domain/checkout/entities/order.entity";
import { IOrderRepository } from "src/internal/domain/checkout/repositories/order.repository";
import { IIdentifierGenerator } from "src/internal/application/ports/tokens/id-generator";
import { IEventEmitter } from "../../ports/events/event";
import { ICheckinService } from "../../ports/integrations/checkin";
import { CreatedOrderEvent } from "src/internal/domain/checkout/events/order-created.event";
import {
  verifyUuid,
  verifyFilePaths,
  sanitizeOutput,
} from "src/external/utils/validator";

@Injectable()
export class CreateOrder {
  constructor(
    @Inject("OrderRepository")
    private orderRepository: IOrderRepository,
    @Inject("EventEmitter")
    private eventEmitter: IEventEmitter,
    @Inject("IdGenerator")
    private idGenerator: IIdentifierGenerator,
    @Inject("CheckinService")
    private checkinService: ICheckinService,
  ) {}

  async execute({ customerId, products }: CreateOrderDto): Promise<Order> {
    verifyUuid(customerId);
    verifyFilePaths(customerId);

    products.map((prod) => {
      verifyUuid(prod.id);
      verifyFilePaths(prod.id);
    });

    await this.checkinService.getCustomerById(customerId);
    await this.checkinService.verifyProductQuantity(products);

    const orderItems = products.map((product) => {
      return new OrderItem({
        id: sanitizeOutput(this.idGenerator.generate()),
        productId: sanitizeOutput(product.id),
        quantity: product.quantity,
        value: product.price,
      });
    });

    const order = new Order({
      customerId: sanitizeOutput(customerId),
      id: sanitizeOutput(this.idGenerator.generate()),
      orderItems,
      createdAt: new Date(),
    });

    await this.orderRepository.create(order);

    this.eventEmitter.emit("order.created", new CreatedOrderEvent(order));

    return order;
  }
}
