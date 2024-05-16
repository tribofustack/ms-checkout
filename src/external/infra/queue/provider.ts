import { IMessageBroker } from 'src/internal/application/ports/queues/message-broker';
import { RabbitMQ } from './rabbitmq';
import {
  EXCHANGE,
  ORDER_BINDING_KEY,
  ORDER_QUEUE,
  PAYMENT_BINDING_KEY,
  PAYMENT_QUEUE,
} from 'src/internal/application/configs/queue';

export class QueueProvider {
  static async init(): Promise<IMessageBroker> {
    console.time('Start message broker');

    const broker = new RabbitMQ();
    await broker.start();

    await broker.createExchange(EXCHANGE);

    await broker.createQueue(PAYMENT_QUEUE);
    await broker.bindQueueInExchange({
      queue: PAYMENT_QUEUE,
      exchange: EXCHANGE,
      bindigKey: PAYMENT_BINDING_KEY,
    });

    await broker.createQueue(ORDER_QUEUE);
    await broker.bindQueueInExchange({
      queue: ORDER_QUEUE,
      exchange: EXCHANGE,
      bindigKey: ORDER_BINDING_KEY,
    });
    
    // quando consumir vai atualizar o pedido
    // await broker.consume(ORDER_QUEUE, (message) =>
    //   makeOrderWaitingPaymentConsumer.handle(message),
    // );

    console.timeEnd('Start message broker');
    return broker;
  }
}
