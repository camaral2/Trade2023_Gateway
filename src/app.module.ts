import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from './services/config/config.service';
import { CompraModule } from './compra/compra.module';
import { AcaoModule } from './acao/acao.module';
import logger from './utils/logger';

@Module({
  imports: [CompraModule, AcaoModule],
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
    logger.log('SERVICE CAD PORT:' + cadService.options.port);
    logger.log('SERVICE CAD HOST:' + cadService.options.host);

    const authService = this.configService.get('authService');
    logger.log('SERVICE Auth PORT:' + authService.options.port);
    logger.log('SERVICE Auth HOST:' + authService.options.host);
  }
}
