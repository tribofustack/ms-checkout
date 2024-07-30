import { IMessageBroker } from "src/internal/application/ports/queues/message-broker";
import {
  EXCHANGE,
  PAYMENT_BINDING_KEY,
  ORDER_QUEUE,
  PRODUCT_QUEUE,
  PAYMENT_QUEUE,
} from "src/internal/application/configs/queue";
import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { PayOrderConsumer } from "src/external/adapters/checkout/rabbitmq/consumers/order-paid.consumer";

@Injectable()
export class OrderQueueSetup implements OnApplicationBootstrap {
  constructor(
    @Inject("MessageBroker")
    private broker: IMessageBroker,
    @Inject("PayOrderConsumer")
    private payOrderConsumer: PayOrderConsumer,
  ) {}

  async onApplicationBootstrap() {
    try {
      console.time("Start message broker");
      setTimeout(async () => this.init(), 20000);
      console.timeEnd("Start message broker");
    } catch (error) {
      console.error(error.message);
    }
  }

  async init(): Promise<void> {
    await this.broker.connect();
    await this.broker.createExchange(EXCHANGE);
    await this.broker.createQueue(ORDER_QUEUE);
    await this.broker.createQueue(PAYMENT_QUEUE);
    await this.broker.createQueue(PRODUCT_QUEUE);
    await this.broker.bindQueueInExchange({
      queue: PAYMENT_QUEUE,
      exchange: EXCHANGE,
      bindigKey: PAYMENT_BINDING_KEY,
    });
    // quando consumir vai atualizar o pedido
    await this.broker.consume(PAYMENT_QUEUE, (message) =>
      this.payOrderConsumer.handle(message),
    );
  }
}
