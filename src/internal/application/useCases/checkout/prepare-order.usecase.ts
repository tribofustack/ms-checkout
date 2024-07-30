import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IOrderRepository } from "src/internal/domain/checkout/repositories/order.repository";
import { DomainException } from "src/internal/application/errors";
import { ChangedOrderStatusEvent } from "src/internal/domain/checkout/events/order-status-changed.event";
import { IEventEmitter } from "../../ports/events/event";
import { orderStatusDto } from "src/internal/domain/checkout/dto/order-status.dto";

@Injectable()
export class PrepareOrder {
  constructor(
    @Inject("OrderRepository")
    private orderRepository: IOrderRepository,
    @Inject("EventEmitter")
    private eventEmitter: IEventEmitter,
  ) {}

  async execute(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne(orderId);
    if (!order) throw new NotFoundException("Order not found");

    if (order.status !== "Aprovado")
      throw new DomainException("Order status is invalid");

    order.updateStatus("Em preparação");
    this.eventEmitter.emit(
      "order-status.changed",
      new ChangedOrderStatusEvent(order),
    );

    console.log("Preparing...");
    setTimeout(() => {
      order.updateStatus("Pronto");
      this.eventEmitter.emit(
        "order-status.changed",
        new ChangedOrderStatusEvent(order),
      );
    }, 20000);
  }
}
