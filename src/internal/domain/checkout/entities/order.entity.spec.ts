import { AttributeException, DomainException } from 'src/internal/application/errors';
import { IOrderItem, OrderItem } from './order-item.entity';
import { IOrder, Order } from './order.entity';

describe('Order Entity', () => {
  describe('validate', () => {
    it('should validate id', () => {
      // create order-item
      let orderItem: IOrderItem = new OrderItem({
        id:  'id-test',
        productId: 'productId-test',
        value: 10,
        quantity: 1,      
      });        

      // arrange
      let order: IOrder;
      try {
        // act
        order = new Order({
          id: null,
          customerId: 'customerId-test',
          orderItems: Array<IOrderItem>(orderItem),
        });
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
        expect(error.message).toBe('id not found.');
        expect(error).toBeInstanceOf(AttributeException);
      }
      expect(order).toBeFalsy();
    });
    it('should validate productId', () => {
      // create order-item
      let orderItem: IOrderItem = new OrderItem({
        id:  'id-test',
        productId: 'productId-test',
        value: 10,
        quantity: 1,      
      });      

      let order: IOrder;
      try {
        order = new Order({
          id: 'id-test',
          customerId: null,
          orderItems: Array<IOrderItem>(orderItem), 
        });
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBe('customerId is required.');
        expect(error).toBeInstanceOf(DomainException);
      }
      expect(order).toBeFalsy();
      
    });
    it('should validate order itens', () => { 
      let order: IOrder;
      try {
        order = new Order({
          id: 'id-test',
          customerId: 'customerId-test',
          orderItems: Array<IOrderItem>(),  
        });
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBe('items are required.');
        expect(error).toBeInstanceOf(DomainException);
      }
      expect(order).toBeFalsy();
    });
  });
});
