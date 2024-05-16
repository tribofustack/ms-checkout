import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SequelizeModule } from '@nestjs/sequelize';
import { Uuid } from 'src/external/infra/tokens/uuid/uuid';
import { ChangeOrderStatusListener } from './listeners/change-order-status.listener';
import { OrderCreatedListener } from './listeners/order-created';
import { OrderController } from './order.controller';
import { OrderItemModel } from './sequelize/order-item-model';
import { OrderModel } from './sequelize/order-model';
import { OrderSequelizeRepository } from './sequelize/order-sequelize.repository';
import {
  CreateOrder,
  FindAllOrders,
  GetCustomerReport,
  GetOrderStatus,
  PayOrder,
  PrepareOrder,
  WithdrawnOrder,
} from 'src/internal/application/useCases/checkout';
import { AxiosHttp } from 'src/external/infra/http/axios';
import { CheckinService } from '../checkin/checkin.api';
import { OrderPublisher } from './rabbitmq/publishers/order.publisher';
import { OrderQueueSetup } from 'src/external/infra/queue/setup';
import { RabbitMQ } from 'src/external/infra/queue/rabbitmq';
import { PayOrderConsumer } from './rabbitmq/consumers/order-paid.consumer';

@Module({
  imports: [
    SequelizeModule.forFeature([
      OrderModel,
      OrderItemModel,
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderSequelizeRepository,
    OrderCreatedListener,
    ChangeOrderStatusListener,
    Uuid,
    CreateOrder,
    PrepareOrder,
    WithdrawnOrder,
    FindAllOrders,
    GetOrderStatus,
    GetCustomerReport,
    PayOrder,
    AxiosHttp,
    CheckinService,
    OrderPublisher,
    OrderQueueSetup,
    PayOrderConsumer,
    { provide: 'Http', useExisting: AxiosHttp },
    { provide: 'EventEmitter', useExisting: EventEmitter2 },
    { provide: 'IdGenerator', useExisting: Uuid },
    { provide: 'OrderRepository', useExisting: OrderSequelizeRepository },
    { provide: 'CheckinService', useExisting: CheckinService },
    RabbitMQ,
    { provide: 'MessageBroker', useExisting: RabbitMQ },
    { provide: 'OrderPublisher', useExisting: OrderPublisher },
    { provide: 'PayOrderConsumer', useExisting: PayOrderConsumer },
    { provide: 'PayOrder', useExisting: PayOrder },
  ],
})
export class OrderModule { }
