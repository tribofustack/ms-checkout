import { Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { IOrderPublisher } from "src/internal/application/ports/queues/message-broker";
import { ChangedOrderStatusEvent } from "src/internal/domain/checkout/events/order-status-changed.event";
import { IOrderRepository } from "src/internal/domain/checkout/repositories/order.repository";

@Injectable()
export class ChangeOrderStatusListener {
  constructor(
    @Inject("OrderRepository")
    private orderRepository: IOrderRepository,
    @Inject("OrderPublisher")
    private orderPublisher: IOrderPublisher,
  ) {}

  @OnEvent("order-status.changed")
  async handle(event: ChangedOrderStatusEvent) {
    const { id, status } = event.order;
    if (status === "Pronto") console.log("Finished.");

    if (status === "Cancelado") {
      // envia mensagem para incrementar produtos
      const products = event.order.orderItems.map((oi) => ({
        productId: oi.productId,
        quantity: oi.quantity,
      }));
      await this.orderPublisher.orderCanceled(products);
    }
    await this.orderRepository.changeStatus(id, status);
  }
}
