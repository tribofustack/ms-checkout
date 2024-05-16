import { IMessageBroker } from 'src/internal/application/ports/queues/message-broker';
import {
  EXCHANGE,
  ORDER_BINDING_KEY,
  ORDER_QUEUE,
} from 'src/internal/application/configs/queue';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PayOrderConsumer } from 'src/external/adapters/checkout/rabbitmq/consumers/order-paid.consumer';

@Injectable()
export class OrderQueueSetup implements OnModuleInit {
  constructor(
    @Inject('MessageBroker')
    private broker: IMessageBroker,
    @Inject('PayOrderConsumer')
    private payOrderConsumer: PayOrderConsumer,
  ) {}

  async onModuleInit() {
    try {
      console.time('Start message broker');
      await this.init();
      console.timeEnd('Start message broker');
    }catch(error) {
      console.error(error.message)
    }
  }

  async init(): Promise<void> {
    await this.broker.connect();
    await this.broker.createExchange(EXCHANGE);
    await this.broker.createQueue(ORDER_QUEUE);
    await this.broker.bindQueueInExchange({
      queue: ORDER_QUEUE,
      exchange: EXCHANGE,
      bindigKey: ORDER_BINDING_KEY,
    });    
    // quando consumir vai atualizar o pedido
    await this.broker.consume(ORDER_QUEUE, (message) => this.payOrderConsumer.handle(message));
  }
}
