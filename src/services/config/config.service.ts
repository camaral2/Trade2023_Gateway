import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    dotenv.config();

    this.envConfig = {
      port: process.env.API_GATEWAY_PORT,
    };
    this.envConfig.acaoService = {
      options: {
        port: process.env.ACAO_SERVICE_PORT,
        host: process.env.ACAO_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.cadService = {
      options: {
        port: process.env.CAD_SERVICE_PORT,
        host: process.env.CAD_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.authService = {
      options: {
        port: process.env.AUTH_SERVICE_PORT,
        host: process.env.AUTH_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };

    this.envConfig.MONGO_URL = process.env.MONGO_URL;
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
