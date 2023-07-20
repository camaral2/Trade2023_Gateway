import { Module } from '@nestjs/common';
import { AcaoController } from './acao.controller';
import { ConfigService } from './../services/config/config.service';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  controllers: [AcaoController],
  providers: [
    ConfigService,
    {
      provide: 'AC_MICROSERVICE',
      useFactory: (configService: ConfigService) => {
        const acServiceOptions = configService.get('acaoService');
        return ClientProxyFactory.create(acServiceOptions);
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
export class AcaoModule {}
