export type productsType = Array<{
    id: string;
    quantity: number;
    price: number;
}>
export interface ICheckinService {
    getCustomerById(customerId: string): Promise<any>
    verifyProductQuantity(products: productsType): Promise<any>
}