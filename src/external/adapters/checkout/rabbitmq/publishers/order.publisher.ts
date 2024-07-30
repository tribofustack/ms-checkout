import { Inject, Injectable } from "@nestjs/common";
import { EXCHANGE } from "src/internal/application/configs/queue";
import {
  IMessageBroker,
  IOrderPublisher,
} from "src/internal/application/ports/queues/message-broker";

@Injectable()
export class OrderPublisher implements IOrderPublisher {
  constructor(
    @Inject("MessageBroker")
    private messageBroker: IMessageBroker,
  ) {}

  async orderCreated(message: any): Promise<void> {
    await this.messageBroker.publishInExchange({
      exchange: EXCHANGE,
      message: JSON.stringify(message),
      routingKey: `orders.created`,
    });
  }

  async orderCanceled(message: any): Promise<void> {
    await this.messageBroker.publishInExchange({
      exchange: EXCHANGE,
      message: JSON.stringify(message),
      routingKey: `orders.canceled`,
    });
  }
}
