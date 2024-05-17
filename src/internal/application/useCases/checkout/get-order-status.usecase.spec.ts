import { Test, TestingModule } from '@nestjs/testing';
import { GetCustomerReport } from './get-customer-report.usecase';
import { IOrderRepository } from 'src/internal/domain/checkout/repositories/order.repository';

describe('GetCustomerReport', () => {
  let getCustomerReport: GetCustomerReport;
  let orderRepositoryMock: jest.Mocked<IOrderRepository>;

  beforeAll(async () => {
    orderRepositoryMock = {
      getReportByCustomer: jest.fn(),
    } as unknown as jest.Mocked<IOrderRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCustomerReport,
        { provide: 'OrderRepository', useValue: orderRepositoryMock },
      ],
    }).compile();

    getCustomerReport = module.get<GetCustomerReport>(GetCustomerReport);
  });

  describe('execute', () => {
    it('should return the customer report for the given customerId', async () => {
      const customerId = 'testCustomerId';
      const report = { purchases: 10, value: 10, };

      orderRepositoryMock.getReportByCustomer.mockResolvedValue(report);

      const result = await getCustomerReport.execute(customerId);

      expect(result).toEqual(report);
      expect(orderRepositoryMock.getReportByCustomer).toHaveBeenCalledWith(customerId);
    });

    it('should handle errors gracefully', async () => {
      const customerId = 'testCustomerId';
      orderRepositoryMock.getReportByCustomer.mockRejectedValue(new Error('Database error'));

      await expect(getCustomerReport.execute(customerId)).rejects.toThrow('Database error');
    });
  });
});
