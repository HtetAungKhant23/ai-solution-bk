import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UserInquiriesTotalDto {
  @ApiProperty()
  @IsOptional()
  startDate?: Date;

  @ApiProperty()
  @IsOptional()
  endDate?: Date;
}
