import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderModule } from './external/adapters/checkout/order.module';
import DatabaseModule from './external/infra/database';
import TokenGeneratorModule from './external/infra/tokens';
import { Jwt } from './external/infra/tokens/jwt/jwt';
import { HealthController } from './external/api/health/health.controller';

@Module({
  imports: [
    OrderModule,
    DatabaseModule,
    TokenGeneratorModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.production', '.env'],
    }),
  ],
  controllers: [HealthController],
  providers: [
    Jwt,
    { provide: 'TokenGenerator', useExisting: Jwt },
  ],
})
export class AppModule {}
