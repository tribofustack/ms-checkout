import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { OrderItemModel } from './order-item-model';
import { CreationOptional } from 'sequelize';

interface IOrderModel {
  id: string;
  total: number;
  customerId: string;
  status: string;
  orderItems: OrderItemModel[];
}

@Table({ 
  tableName: 'orders',
  timestamps: true,
})
class OrderModel extends Model implements IOrderModel {
  @Column({
    field: 'id',
    primaryKey: true,
    unique: true,
    allowNull: false,
    type: DataType.STRING,
  })
  declare id: string;

  @Column({
    field: 'customer_id',
    allowNull: false,
    type: DataType.STRING,
  })
  declare customerId: string;

  @HasMany(() => OrderItemModel)
  declare orderItems: OrderItemModel[];

  @Column({
    field: 'status',
    allowNull: false,
    type: DataType.STRING,
  })
  declare status: string;

  @Column({
    field: 'total',
    allowNull: false,
    type: DataType.DECIMAL(10, 2),
  })
  declare total: number;

  @CreatedAt
  declare createdAt: CreationOptional<Date>
}

export { OrderModel };
