import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompraController } from './compra/compra.controller';

import { ConfigService } from './services/config/config.service';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  imports: [],
  controllers: [AppController, CompraController],
  providers: [
    AppService,
    ConfigService,
    {
      provide: 'CAD_MICROSERVICE',
      useFactory: (configService: ConfigService) => {
        const cadServiceOptions = configService.get('cadService');
        return ClientProxyFactory.create(cadServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
