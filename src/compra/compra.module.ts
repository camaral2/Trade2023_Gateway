import { Module } from '@nestjs/common';
import { CompraController } from './compra.controller';
import { ConfigService } from './../services/config/config.service';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  controllers: [CompraController],
  providers: [
    ConfigService,
    {
      provide: 'CAD_MICROSERVICE',
      useFactory: (configService: ConfigService) => {
        const cadServiceOptions = configService.get('cadService');
        return ClientProxyFactory.create(cadServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'AUTH_CLIENT',
      useFactory: (configService: ConfigService) => {
        const authServiceOptions = configService.get('authService');
        return ClientProxyFactory.create(authServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class CompraModule {}
