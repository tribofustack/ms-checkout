import { Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { IOrderPublisher } from "src/internal/application/ports/queues/message-broker";
import { CreatedOrderEvent } from "src/internal/domain/checkout/events/order-created.event";

@Injectable()
export class OrderCreatedListener {
  constructor(
    @Inject("OrderPublisher")
    private orderPublisher: IOrderPublisher,
  ) {}

  @OnEvent("order.created")
  async handle(event: CreatedOrderEvent) {
    await this.orderPublisher.orderCreated(event);
  }
}
