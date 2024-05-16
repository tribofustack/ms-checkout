import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IOrderRepository } from 'src/internal/domain/checkout/repositories/order.repository';
import { DomainException } from 'src/internal/application/errors';
import { ChangedOrderStatusEvent } from 'src/internal/domain/checkout/events/order-status-changed.event';
import { IEventEmitter } from '../../ports/events/event';
import { paymentDto } from 'src/internal/domain/checkout/dto/payment.dto';
import { orderStatusDto } from 'src/internal/domain/checkout/dto/order-status.dto';

@Injectable()
export class PayOrder {
    constructor(
        @Inject('OrderRepository')
        private orderRepository: IOrderRepository,
        @Inject('EventEmitter')
        private eventEmitter: IEventEmitter,
    ) { }

    // é chamado quando conclui o pagamento (com devido status)
    async execute(payment: paymentDto): Promise<void> {
        const order = await this.orderRepository.findOne(payment.orderId);
        if (!order) throw new NotFoundException('Order not found');
        // deve atualizar o order com o devido status

        // if (order.status !== 'Recebido')
        //     throw new DomainException('Order status is invalid');

        // if (payment.status !== 'Pendente de pagamento')
        //     throw new DomainException('Payment must be done');

        this.eventEmitter.emit(
            'order-status.changed',
            new ChangedOrderStatusEvent({
                orderId: order.id,
                status: payment.status as orderStatusDto,
            }),
        );
    }
}