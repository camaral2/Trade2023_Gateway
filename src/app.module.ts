import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from './services/config/config.service';
import { CompraModule } from './compra/compra.module';

@Module({
  imports: [CompraModule],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
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
export class AppModule {}
