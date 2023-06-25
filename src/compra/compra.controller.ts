import {
  Controller,
  Inject,
  Get,
  Req,
  Param,
  UseGuards,
  UseFilters,
  UsePipes,
  ValidationPipe,
  Logger,
  BadGatewayException,
  HttpCode,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { GetComprasResponseDto } from './dto/get-compra-response.dto';
import { ICompra } from './interfaces/compra.interface';
import { AuthGuard } from './../services/guards/auth-guard';
import logger from '../utils/logger';

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

  // @Get('')
  // //@Authorization(true)
  // //@Permission('compra_findAll')
  // @ApiOkResponse({
  //   type: GetComprasResponseDto,
  //   description: 'List of compras of user',
  // })
  // public async getCompra(
  //   @Param('userId') userId: string,
  // ): Promise<GetComprasResponseDto> {
  //   try {
  //     let ret: ICompra[] = null;
  //     const valRet = await this.cadServiceClient.send(
  //       'compra_findAll',
  //       JSON.stringify(userId),
  //     );

  //     Logger.debug('just before subscribe');

  //     valRet.subscribe(
  //       (data) => {
  //         console.log(data);
  //         ret = data;

  //         return {
  //           compras: ret,
  //         };
  //       },
  //       (err) => {
  //         //console.log('Error:', err.message);
  //         //new BadGatewayException('getCompra:' + err.message);
  //         throw err;
  //       },
  //     );

  //     // valRet.subscribe((x) => {
  //     //   const { weather } = x.data;
  //     //   Logger.debug(weather);
  //     // });
  //     Logger.debug('After subscribe');

  //     //const ret: ICompra[] = await firstValueFrom(valRet);

  //   } catch (e) {
  //     Logger.log('getCompra:' + e);
  //     new BadGatewayException('getCompra:' + e);
  //   } finally {
  //     this.cadServiceClient.close();
  //   }
  // }

  @Get(':userId')
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'ID of the User',
  })
  //@Authorization(true)
  //@Permission('compra_findAll')
  @ApiOkResponse({
    type: GetComprasResponseDto,
    description: 'List of compras of user',
  })
  public async getCompra(
    @Param('userId') userId: string,
  ): Promise<GetComprasResponseDto> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required (userId)');
      }
      const result = await this.cadServiceClient
        .send('compra_findAll', userId)
        .toPromise();

      const ret: ICompra[] = result;
      return {
        compras: ret,
      };
    } catch (error) {
      Logger.error('getCompra:', error);
      throw new BadGatewayException('getCompra:' + error.message);
    } finally {
      await this.cadServiceClient.close();
    }

    //   try {
    //     let ret: ICompra[] = null;
    //     const valRet = await this.cadServiceClient.send(
    //       'compra_findAll',
    //       JSON.stringify(userId),
    //     );

    //     Logger.debug('just before subscribe');

    //     valRet.subscribe(
    //       (data) => {
    //         console.log(data);
    //         ret = data;

    //         return {
    //           compras: ret,
    //         };
    //       },
    //       (err) => {
    //         //console.log('Error:', err.message);
    //         //new BadGatewayException('getCompra:' + err.message);
    //         throw err;
    //       },
    //     );

    //     // valRet.subscribe((x) => {
    //     //   const { weather } = x.data;
    //     //   Logger.debug(weather);
    //     // });
    //     Logger.debug('After subscribe');

    //     //const ret: ICompra[] = await firstValueFrom(valRet);
    //   } catch (e) {
    //     Logger.log('getCompra:' + e);
    //     new BadGatewayException('getCompra:' + e);
    //   } finally {
    //     this.cadServiceClient.close();
    //   }
  }
}
