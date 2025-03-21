import { PaginationDto } from '@app/core/dtos/pagination.dto';
import { SearchDto } from '@app/core/dtos/search.dto';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserInquiriesDto extends IntersectionType(PaginationDto, SearchDto) {
  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  endDate: Date;
}
