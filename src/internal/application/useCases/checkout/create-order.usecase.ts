import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from 'src/internal/domain/checkout/dto/create-order.dto';
import { OrderItem } from 'src/internal/domain/checkout/entities/order-item.entity';
import { Order } from 'src/internal/domain/checkout/entities/order.entity';
// import { CreatedOrderEvent } from 'src/internal/domain/checkout/events/order-created.event';
import { IOrderRepository } from 'src/internal/domain/checkout/repositories/order.repository';
import { IIdentifierGenerator } from 'src/internal/application/ports/tokens/id-generator';
import { IEventEmitter } from '../../ports/events/event';
import { ICheckinService } from '../../ports/integrations/checkin';
import { CreatedOrderEvent } from 'src/internal/domain/checkout/events/order-created.event';
import { ChangedOrderStatusEvent } from 'src/internal/domain/checkout/events/order-status-changed.event';

@Injectable()
export class CreateOrder {
    constructor(
        @Inject('OrderRepository')
        private orderRepository: IOrderRepository,
        @Inject('EventEmitter')
        private eventEmitter: IEventEmitter,
        @Inject('IdGenerator')
        private idGenerator: IIdentifierGenerator,
        @Inject('CheckinService')
        private checkinService: ICheckinService,
    ) { }

    async execute(createOrderDto: CreateOrderDto): Promise<Order> {
        const { products } = createOrderDto;
        
        await this.checkinService.getCustomerById(createOrderDto.customerId)
        await this.checkinService.verifyProductQuantity(createOrderDto.products)

        const orderItems = products.map(product => {
            return new OrderItem({
                id: this.idGenerator.generate(),
                productId: product.id,
                quantity: product.quantity,
                value: product.price,
            });
        });
        
        const order = new Order({
            customerId: createOrderDto.customerId,
            id: this.idGenerator.generate(),
            orderItems,
            createdAt: new Date()
        });

        await this.orderRepository.create(order);        
        
        this.eventEmitter.emit('order.created', new CreatedOrderEvent(order));
        // this.eventEmitter.emit(
        //     'order-status.changed',
        //     new ChangedOrderStatusEvent({
        //         orderId: order.id,
        //         status: 'Pendente de pagamento',
        //     })
        // );

        return order;
    }
}