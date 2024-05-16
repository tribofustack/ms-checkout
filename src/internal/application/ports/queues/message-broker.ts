export interface IMessageBroker {
  connect(): Promise<void>;
  createQueue(queueName: string): Promise<void>;
  createExchange(exchangeName: string): Promise<void>;
  bindQueueInExchange({
    queue,
    exchange,
    bindigKey,
  }: {
    queue: string;
    exchange: string;
    bindigKey: string;
  }): Promise<void>;
  publishInExchange({
    exchange,
    message,
    routingKey,
  }: {
    exchange: string;
    routingKey: string;
    message: string;
  }): Promise<boolean>;
  consume(
    queue: string,
    callback: (message: any) => Promise<void>,
  ): Promise<void>;
}

export interface IPublisher {
  sendMessage(message: any): Promise<void>;
}
