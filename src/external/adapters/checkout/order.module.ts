import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SequelizeModule } from '@nestjs/sequelize';
import { Uuid } from 'src/external/infra/tokens/uuid/uuid';

import { OrderConsumer } from './bullmq/consumers/order.consumer';
import { ChangeOrderStatusListener } from './bullmq/listeners/change-order-status.listener';
import { PublishOrderRequestListener } from './bullmq/listeners/publish-order-request.listener';
import { OrderController } from './order.controller';
import { OrderItemModel } from './sequelize/order-item-model';
import { OrderModel } from './sequelize/order-model';
import { OrderSequelizeRepository } from './sequelize/order-sequelize.repository';
import QueueModule from 'src/external/infra/queue';

import { CreateOrder } from '../../../internal/application/useCases/checkout/create-order.usecase';
import { PrepareOrder } from '../../../internal/application/useCases/checkout/prepare-order.usecase';
import { WithdrawnOrder } from '../../../internal/application/useCases/checkout/withdraw-order-usecase';
import { FindAllOrders } from '../../../internal/application/useCases/checkout/find-all-orders.usecase';
import { GetOrderStatus } from '../../../internal/application/useCases/checkout/get-order-status.usecase';
import { GetCustomerReport } from '../../../internal/application/useCases/checkout/get-customer-report.usecase';
import { PayOrder } from '../../../internal/application/useCases/checkout/pay-order.usecase';

@Module({
  imports: [
    SequelizeModule.forFeature([
      OrderModel,
      OrderItemModel,
    ]),
    QueueModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderSequelizeRepository,
    PublishOrderRequestListener,
    ChangeOrderStatusListener,
    OrderConsumer,
    Uuid,
    CreateOrder,
    PrepareOrder,
    WithdrawnOrder,
    FindAllOrders,
    GetOrderStatus,
    GetCustomerReport,
    PayOrder,
    { provide: 'EventEmitter', useExisting: EventEmitter2 },
    { provide: 'IdGenerator', useExisting: Uuid },
  ],
})
export class OrderModule { }
