import { BadRequestException, Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { CurrentAdmin, IAuthAdmin } from '@app/core/decorators/auth.decorators';
import { AdminService } from './admin.service';
import { AdminAuthGuard } from '../auth/guard/admin.guard';
import { EventDto } from './dto/event.dto';

@ApiTags('Admin')
@Controller({ version: '1' })
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  async getMe(@CurrentAdmin() admin: IAuthAdmin) {
    try {
      const adminMe = await this.adminService.getMe(admin.id);
      return {
        _data: adminMe,
        _metadata: {
          message: 'Admin successfully me fetched.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to fetch me',
      });
    }
  }

  @Get('user-inquries')
  @ApiBearerAuth()
  // @UseGuards(AdminAuthGuard)
  @ApiOperation({ description: 'Create New Event' })
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

  @Post('event')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ description: 'Create event' })
  @ApiBody({ type: EventDto })
  async createEvent(@Body() dto: EventDto, @CurrentAdmin() admin: IAuthAdmin) {
    try {
      const newEvent = await this.adminService.createEvent(dto, admin.id);
      return {
        _data: newEvent,
        _metadata: {
          message: 'Event saved successfully.',
          statusCode: HttpStatus.CREATED,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to save new event.',
      });
    }
  }
}
