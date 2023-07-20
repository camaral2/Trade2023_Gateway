import { ApiProperty } from '@nestjs/swagger';
import { IAcaoConfig } from '../interfaces/acaoConfig.interface';
import { acaoConfigRequestSuccess } from '../mocks/acaoConfig-request-success.mock';

export class GetAcaoConfigResponseDto {
  @ApiProperty({
    example: {
      compras: [acaoConfigRequestSuccess],
    },
    nullable: true,
  })
  acoes: IAcaoConfig[];
}
