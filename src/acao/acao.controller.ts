import {
  BadGatewayException,
  Controller,
  Inject,
  Get,
  Logger,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { AuthGuard } from './../services/guards/auth-guard';
import { GetAcaoConfigResponseDto } from './dto/get-acao-config-response.dto';
import { IAcaoConfig } from './interfaces/acaoConfig.interface';

@Controller('acao')
@ApiTags('acao')
@UseGuards(AuthGuard)
@ApiBearerAuth()
//@UseFilters(new HttpExceptionFilter())
@UsePipes(new ValidationPipe())
export class AcaoController {
  constructor(
    @Inject('AC_MICROSERVICE') private readonly cadServiceClient: ClientProxy,
  ) {}

  @Get()
  @ApiOkResponse({
    type: GetAcaoConfigResponseDto,
    description: 'List of all acoes',
  })
  public async getAcao(): Promise<GetAcaoConfigResponseDto> {
    try {
      const result = await this.cadServiceClient.send('get_acao_all', '');
      const ret: IAcaoConfig[] = await firstValueFrom(result);

      return {
        acoes: ret,
      };
    } catch (error) {
      Logger.error('getAcao:', error);
      throw new BadGatewayException('getAcao:' + error.message);
    } finally {
      await this.cadServiceClient.close();
    }
  }
}
