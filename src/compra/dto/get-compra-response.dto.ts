import { ApiProperty } from '@nestjs/swagger';
import { ICompra } from '../interfaces/compra.interface';
import { compraRequestSuccess } from '../mocks/compra-request-success.mock';

export class GetComprasResponseDto {
  @ApiProperty({
    example: {
      compras: [compraRequestSuccess],
    },
    nullable: true,
  })
  compras: ICompra[];
}
