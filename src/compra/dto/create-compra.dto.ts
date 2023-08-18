import { ApiProperty } from '@nestjs/swagger';

export class CreateCompraDto {
  @ApiProperty({ example: 'MGLU3' })
  acao: string;
  @ApiProperty({ example: '63b34f5da25fbb24d295ab24' })
  user: string;
  @ApiProperty({ example: +new Date() })
  data: Date;
  @ApiProperty({ example: 2.3 })
  valor: number;
  @ApiProperty({ example: 200 })
  qtd: number;
}
