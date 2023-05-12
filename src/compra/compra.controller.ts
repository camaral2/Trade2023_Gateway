import { Controller, Inject, Get, Req, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { GetComprasResponseDto } from './dto/get-compra-response.dto';
import { ICompra } from './interfaces/compra.interface';

//import { Authorization } from './decorators/authorization.decorator';
//import { Permission } from './decorators/permission.decorator';

@Controller('compra')
@ApiTags('compra')
export class CompraController {
  constructor(
    @Inject('CAD_MICROSERVICE') private readonly cadServiceClient: ClientProxy,
  ) {}

  @Get()
  //@Authorization(true)
  //@Permission('compra_findAll')
  @ApiOkResponse({
    type: GetComprasResponseDto,
    description: 'List of compras of user',
  })
  public async getCompra(
    @Param('userId') userId: string,
  ): Promise<GetComprasResponseDto> {
    const valRet = await this.cadServiceClient.send(
      'compra_findAll',
      JSON.stringify(userId),
    );

    const ret: ICompra[] = await firstValueFrom(valRet);

    return {
      compras: ret,
    };
  }
}
