import { ApiProperty } from '@nestjs/swagger';
import { ICompra } from '../interfaces/compra.interface';
import { compraRequestSuccess } from '../mocks/compra-request-success.mock';

export class CompraResponseDto {
  @ApiProperty({
    example: {
      compra: compraRequestSuccess,
    },
    nullable: false,
  })
  compra: ICompra;
}
