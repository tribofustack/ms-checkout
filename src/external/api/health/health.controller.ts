import { Controller, Get } from '@nestjs/common';
import { responseError } from 'src/external/infra/errors/reponse.error';

@Controller('health')
export class HealthController {
    @Get()
    async checkHealth() {
        try {
            return { status: 'ok' };
        } catch(error: any) {
            return responseError(error);
        }
    }
}
