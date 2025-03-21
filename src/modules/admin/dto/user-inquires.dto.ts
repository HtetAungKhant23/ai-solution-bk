import { PaginationDto } from '@app/core/dtos/pagination.dto';
import { SearchDto } from '@app/core/dtos/search.dto';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export class UserInquiriesDto extends IntersectionType(PaginationDto, SearchDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['all', 'seen', 'unSeen'])
  type: 'all' | 'seen' | 'unSeen';

  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  endDate: Date;
}
