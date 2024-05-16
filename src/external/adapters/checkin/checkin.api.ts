import { Inject, Injectable } from '@nestjs/common';
import { env } from 'src/internal/application/configs/env';
import { IHttp } from 'src/internal/application/ports/http/http';
import { ICheckinService, productsType } from 'src/internal/application/ports/integrations/checkin';

@Injectable()
export class CheckinService implements ICheckinService {
    private checkinUrl: string;

    constructor(
        @Inject('Http')
        private httpService: IHttp,
    ) {
        this.checkinUrl = `http://${env.checkinHost}:${env.checkinPort}`
    }

    async getCustomerById(customerId: string) {
        const url = `${this.checkinUrl}/customers/${customerId}`
        const { body } = await this.httpService.get({ url })
        return body
    }
    
    async verifyProductQuantity(products: productsType) {
        const url = `${this.checkinUrl}/products/check`
        const { body } = await this.httpService.post({ 
            url,
            body: products
        })
        return body
    }
}