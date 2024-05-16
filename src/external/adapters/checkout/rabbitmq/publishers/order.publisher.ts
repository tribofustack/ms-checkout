import { Inject, Injectable } from '@nestjs/common';
import { EXCHANGE, ORDER_BINDING_KEY } from 'src/internal/application/configs/queue';
import { IMessageBroker, IPublisher } from 'src/internal/application/ports/queues/message-broker';

@Injectable()
export class OrderPublisher implements IPublisher {
  constructor(
    @Inject('MessageBroker')
    private messageBroker: IMessageBroker
  ) {}

  async sendMessage(message: any): Promise<void> {
    await this.messageBroker.publishInExchange({
      exchange: EXCHANGE,
      message: JSON.stringify(message),
      routingKey: `${ORDER_BINDING_KEY}.created`,
    });
  }
}
