import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;
}
