import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from './services/config/config.service';
import { CompraModule } from './compra/compra.module';
import logger from './utils/logger';

@Module({
  imports: [CompraModule],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const port = this.configService.get('port');
    logger.log('PORT:' + port);

    const acaoService = this.configService.get('acaoService');
    logger.log('SERVICE ACAO PORT:' + acaoService.options.port);
    logger.log('SERVICE ACAO HOST:' + acaoService.options.host);

    const cadService = this.configService.get('cadService');
    logger.log('SERVICE ACAO PORT:' + cadService.options.port);
    logger.log('SERVICE ACAO HOST:' + cadService.options.host);

    const authService = this.configService.get('authService');
    logger.log('SERVICE ACAO PORT:' + authService.options.port);
    logger.log('SERVICE ACAO HOST:' + authService.options.host);
  }
}
