import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompraDto {
  @ApiProperty({ example: '63b34f5da25fbb24d295ab24' })
  _id: string;
  @ApiProperty({ example: +new Date() })
  data: Date;
  @ApiProperty({ example: 2.3 })
  valor: number;
  @ApiProperty({ example: 200 })
  qtd: number;
}
