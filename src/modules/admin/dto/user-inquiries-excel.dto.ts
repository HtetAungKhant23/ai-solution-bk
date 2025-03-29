import { SearchDto } from '@app/core/dtos/search.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class UserInquiriesExcelDto extends SearchDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['all', 'seen', 'unSeen'])
  type: 'all' | 'seen' | 'unSeen';

  @ApiProperty({ required: false })
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  endDate?: Date;
}
