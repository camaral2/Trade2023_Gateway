import {
  Controller,
  Inject,
  Get,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Logger,
  BadGatewayException,
  BadRequestException,
  Post,
  Body,
  Put,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiParam,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { GetComprasResponseDto } from './dto/get-compra-response.dto';
import { ICompra } from './interfaces/compra.interface';
import { AuthGuard } from './../services/guards/auth-guard';
import { CreateCompraDto } from './dto/create-compra.dto';
import { CompraResponseDto } from './dto/compra-response.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { SetSaleCompraDto } from './dto/set-sale-compra.dto';
import { CompraIdDto } from './dto/compra-Id.dto';
import { ReturnDeleteUpdateDto } from 'src/utils/return-delete-update.dto';
import { CompraRequestDto } from './dto/compra-request.dto';

//import { Authorization } from './decorators/authorization.decorator';
//import { Permission } from './decorators/permission.decorator';

@Controller('compra')
@ApiTags('compra')
@UseGuards(AuthGuard)
@ApiBearerAuth()
//@UseFilters(new HttpExceptionFilter())
@UsePipes(new ValidationPipe())
export class CompraController {
  constructor(
    @Inject('CAD_MICROSERVICE') private readonly cadServiceClient: ClientProxy,
  ) {}

  @Get(':userId/:acao')
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'ID of the User',
  })
  @ApiParam({
    name: 'acao',
    type: String,
    description: 'Sigla of acao',
  })
  @ApiOkResponse({
    type: GetComprasResponseDto,
    description: 'List of compras of user',
  })
  public async getCompra(
    @Param('userId') userId: string,
    @Param('acao') acao: string,
  ): Promise<GetComprasResponseDto> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required (userId)');
      }
      const result = await this.cadServiceClient.send('compra_findAll', {
        user: userId,
        acao: acao,
      });
      //  .toPromise();
      const ret: ICompra[] = await firstValueFrom(result);

      //const ret: ICompra[] = result;
      return {
        compras: ret,
      };
    } catch (error) {
      Logger.error('getCompra:', error);
      throw new BadGatewayException('getCompra:' + error.message);
    } finally {
      await this.cadServiceClient.close();
    }
  }

  @Post('')
  @ApiCreatedResponse({
    type: CompraResponseDto,
  })
  public async createCompra(
    @Body() compraRequest: CreateCompraDto,
  ): Promise<CompraResponseDto> {
    try {
      const result = await this.cadServiceClient.send(
        'compra_create',
        compraRequest,
      );

      const ret: CompraResponseDto = await firstValueFrom(result);
      return ret;
    } catch (error) {
      Logger.error('createCompra:', error);
      throw new BadGatewayException('createCompra:' + error.message);
    } finally {
      await this.cadServiceClient.close();
    }
  }

  @Put('')
  @ApiOkResponse({
    type: CompraResponseDto,
  })
  public async updateCompra(
    @Body() compraRequest: CompraRequestDto,
  ): Promise<ReturnDeleteUpdateDto> {
    try {
      const result = await this.cadServiceClient.send(
        'compra_update',
        compraRequest,
      );

      const ret: ReturnDeleteUpdateDto = await firstValueFrom(result);
      return ret;
    } catch (error) {
      Logger.error('updateCompra:', error);
      throw new BadGatewayException('updateCompra:' + error.message);
    } finally {
      await this.cadServiceClient.close();
    }
  }

  @Patch('')
  @ApiOkResponse({
    type: CompraResponseDto,
  })
  public async setVendaCompra(
    @Body() compraRequest: CompraRequestDto,
  ): Promise<ReturnDeleteUpdateDto> {
    try {
      const result = await this.cadServiceClient.send(
        'compra_venda',
        compraRequest,
      );

      const ret: ReturnDeleteUpdateDto = await firstValueFrom(result);
      return ret;
    } catch (error) {
      Logger.error('setVendaCompra:', error);
      throw new BadGatewayException('setVendaCompra:' + error.message);
    } finally {
      await this.cadServiceClient.close();
    }
  }

  @Delete(':id')
  @ApiOkResponse({
    type: CompraResponseDto,
  })
  public async deleteCompra(
    @Param() params: CompraRequestDto,
  ): Promise<ReturnDeleteUpdateDto> {
    try {
      const result = await this.cadServiceClient.send('compra_remove', params);

      const ret: ReturnDeleteUpdateDto = await firstValueFrom(result);
      return ret;
    } catch (error) {
      Logger.error('deleteCompra:', error);
      throw new BadGatewayException('deleteCompra:' + error.message);
    } finally {
      await this.cadServiceClient.close();
    }
  }
}
