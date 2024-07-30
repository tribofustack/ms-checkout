import { IOrder } from "../entities/order.entity";

export class ChangedOrderStatusEvent {
  constructor(public order: IOrder) {}
}
