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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { GetComprasResponseDto } from './dto/get-compra-response.dto';
import { ICompra } from './interfaces/compra.interface';
import { AuthGuard } from './../services/guards/auth-guard';

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

  @Get('')
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
      const result = await this.cadServiceClient
        .send('compra_findAll', JSON.stringify(userId))
        .toPromise();

      const ret: ICompra[] = result;

      return {
        compras: ret,
      };
      return result;
    } catch (error) {
      Logger.error('getCompra:', error);
      throw new BadGatewayException('getCompra:' + error.message);
    }

    try {
      let ret: ICompra[] = null;
      const valRet = await this.cadServiceClient.send(
        'compra_findAll',
        JSON.stringify(userId),
      );

      Logger.debug('just before subscribe');

      valRet.subscribe(
        (data) => {
          console.log(data);
          ret = data;

          return {
            compras: ret,
          };
        },
        (err) => {
          //console.log('Error:', err.message);
          //new BadGatewayException('getCompra:' + err.message);
          throw err;
        },
      );

      // valRet.subscribe((x) => {
      //   const { weather } = x.data;
      //   Logger.debug(weather);
      // });
      Logger.debug('After subscribe');

      //const ret: ICompra[] = await firstValueFrom(valRet);
    } catch (e) {
      Logger.log('getCompra:' + e);
      new BadGatewayException('getCompra:' + e);
    } finally {
      this.cadServiceClient.close();
    }
  }
}
