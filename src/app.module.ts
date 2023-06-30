import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from './services/config/config.service';
import { CompraModule } from './compra/compra.module';

@Module({
  imports: [CompraModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
