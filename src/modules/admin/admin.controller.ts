import { BadRequestException, Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller({ version: '1' })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('user-inquries')
  @ApiProperty({ description: 'Get All User Inquries' })
  async getAllUserInquries() {
    try {
      const userInquries = await this.adminService.getAllUserInquries();
      return {
        _data: userInquries,
        _metadata: {
          message: 'User inquries successfully fetched.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to fetch user inquries.',
      });
    }
  }
}
