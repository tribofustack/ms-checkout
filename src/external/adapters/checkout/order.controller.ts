import { Controller, Post, Body, Get, Param, Query } from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { responseError } from "src/external/infra/errors/reponse.error";
import {
  CreateOrderSwagger,
  CreatedOrderSwagger,
  LoadedOrdersSwagger,
  ReportByCustomerOrderSwagger,
} from "src/internal/application/docs/swagger/checkout/create-order.dto";
import {
  CreateOrder,
  FindAllOrders,
  GetCustomerReport,
  GetOrderStatus,
  PrepareOrder,
  WithdrawnOrder,
} from "src/internal/application/useCases/checkout";
import { CreateOrderDto } from "src/internal/domain/checkout/dto/create-order.dto";

@ApiTags("Orders")
@Controller("orders")
export class OrderController {
  constructor(
    private readonly createOrder: CreateOrder,
    private readonly prepareOrder: PrepareOrder,
    private readonly withdrawnOrder: WithdrawnOrder,
    private readonly findAllOrders: FindAllOrders,
    private readonly getOrderStatus: GetOrderStatus,
    private readonly getCustomerReport: GetCustomerReport,
  ) {}

  @ApiOperation({ summary: "Create Order" })
  @ApiBody({ type: CreateOrderSwagger })
  @ApiResponse({
    status: 201,
    description: "Order successfully created.",
    type: CreatedOrderSwagger,
  })
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      return await this.createOrder.execute(createOrderDto);
    } catch (err) {
      console.error(err.message);
      return responseError(err);
    }
  }

  @ApiOperation({ summary: "Prepare Order" })
  @ApiResponse({ status: 201 })
  @Post(":id/prepare")
  async prepare(@Param("id") id: string) {
    try {
      return await this.prepareOrder.execute(id);
    } catch (err) {
      return responseError(err);
    }
  }

  @ApiOperation({ summary: "withdrawn" })
  @ApiResponse({ status: 201 })
  @Post(":id/withdrawn")
  async withdrawn(@Param("id") id: string) {
    try {
      return await this.withdrawnOrder.execute(id);
    } catch (err) {
      return responseError(err);
    }
  }

  @ApiOperation({ summary: "Get Orders" })
  @ApiResponse({
    status: 200,
    description: "Order successfully loaded.",
    type: LoadedOrdersSwagger,
  })
  @ApiQuery({
    name: "customerId",
    description: "Query by customer id.",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "status",
    description: "Query by order status.",
    required: false,
    type: String,
  })
  @Get()
  async getOrders(
    @Query("customerId") customerId?: string,
    @Query("status") status?: string,
  ) {
    try {
      return await this.findAllOrders.execute(customerId, status);
    } catch (err) {
      return responseError(err);
    }
  }

  @ApiOperation({ summary: "Get Order Status" })
  @ApiResponse({
    status: 200,
    description: "Order status returned.",
    type: ReportByCustomerOrderSwagger,
  })
  @Get(":id/status")
  async getStatus(@Param("id") id: string) {
    try {
      return await this.getOrderStatus.execute(id);
    } catch (err: any) {
      return responseError(err);
    }
  }

  @ApiOperation({ summary: "Create Report" })
  @ApiResponse({
    status: 200,
    description: "Report successfully created.",
    type: ReportByCustomerOrderSwagger,
  })
  @Get("customer/:id")
  async handleCustomerReport(@Param("id") id: string) {
    try {
      // await this.findCustomerById.execute(id);
      return await this.getCustomerReport.execute(id);
    } catch (err: any) {
      return responseError(err);
    }
  }
}
