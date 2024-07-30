import { Inject, Injectable } from "@nestjs/common";
import { PayOrder } from "src/internal/application/useCases/checkout";

@Injectable()
export class PayOrderConsumer {
  constructor(
    @Inject("PayOrder")
    private readonly payOrderUseCase: PayOrder,
  ) {}

  async handle(message: any) {
    try {
      console.log("executing payOrderUseCase", message);
      await this.payOrderUseCase.execute(message);
    } catch (error) {
      console.error("error on PayOrderConsumer", error.message);
    }
  }
}
