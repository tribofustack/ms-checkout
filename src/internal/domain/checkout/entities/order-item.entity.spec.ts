import { AttributeException, DomainException } from 'src/internal/application/errors';
import { IOrderItem, OrderItem } from './order-item.entity';

describe('OrderItem Entity', () => {
  describe('validate', () => {
    it('should validate id', () => {
      // arrange
      let orderItem: IOrderItem;
      try {
        // act
        orderItem = new OrderItem({
          id: null,
          productId: 'productId-test',
          value: 10,
          quantity: 1,
        });
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
        expect(error.message).toBe('id not found.');
        expect(error).toBeInstanceOf(AttributeException);
      }
      expect(orderItem).toBeFalsy();
    });
    it('should validate product id', () => {
      let orderItem: IOrderItem;
      try {
        orderItem = new OrderItem({
          id:  'id-test',
          productId: null,
          value: 10,
          quantity: 1,      
        });
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBe('productId is required.');
        expect(error).toBeInstanceOf(DomainException);
      }
      expect(orderItem).toBeFalsy();
    });
    it('should validate value', () => {
      // arrange
      let orderItem: IOrderItem;
      try {
        // act
        orderItem = new OrderItem({
          id: 'id-test',
          productId: 'productId-test',
          value: null,
          quantity: 1,
        });
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
        expect(error.message).toBe('value not found.');
        expect(error).toBeInstanceOf(AttributeException);
      }
      expect(orderItem).toBeFalsy();
    });
    it('should validate quantity', () => {
      let orderItem: IOrderItem;
      try {
        orderItem = new OrderItem({
          id: 'id-test',
          productId: 'productId-test',
          value: 10,
          quantity: null,      
        });
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBe('quantity not found.');
        expect(error).toBeInstanceOf(AttributeException);
      }
      expect(orderItem).toBeFalsy();
    });
    it('should validate total', () => {
      let orderItem: IOrderItem;
      let error: any;
      try {
        orderItem = new OrderItem({
          id: 'id-test',
          productId: 'productId-test',
          value: 10,
          quantity: 1,      
        });
      } catch (e) {
        error = e
      }
      expect(error).toBeUndefined();
      expect(orderItem.total).toBe(orderItem.value * orderItem.quantity);
    });
  });
});
