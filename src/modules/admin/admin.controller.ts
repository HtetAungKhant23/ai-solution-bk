import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { CurrentAdmin, IAuthAdmin } from '@app/core/decorators/auth.decorators';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { CloudinaryService } from '@app/shared/upload/cloudinary.service';
import { IPagination, Pagination } from '@app/core/decorators/pagination.decorators';
import { EventDto } from './dto/event.dto';
import { AdminAuthGuard } from '../auth/guard/admin.guard';
import { AdminService } from './admin.service';
import { UserInquiriesDto } from './dto/user-inquires.dto';
import { UserInquiriesTotalDto } from './dto/user-inquiries-total.dto';

@ApiTags('Admin')
@Controller({ version: '1' })
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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


  @Get('user-inquries/total')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ description: 'Get All User Inquiries Total' })
  async getAllUserInquriesTotal(@Query() dto: UserInquiriesTotalDto) {
    try {
      const result = await this.adminService.getAllUserInquriesTotal(dto);
      return {
        _data: result,
        _metadata: {
          message: 'User inquries total successfully fetched.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to fetch user inquries total.',
      });
    }
  }

  @Get('user-inquries')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ description: 'Get All User Inquiries' })
  async getAllUserInquries(@Query() dto: UserInquiriesDto, @Pagination() paginate: IPagination) {
    try {
      const result = await this.adminService.getAllUserInquries(dto, paginate);
      return {
        _data: result,
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

  @Delete('user-inquries/:id')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ description: 'Delete inquries' })
  @ApiParam({ type: 'string', name: 'id' })
  async delete(@Param('id') id: string) {
    try {
      const deletedInquires = await this.adminService.deletedInquires(id);
      return {
        _data: deletedInquires,
        _metadata: {
          message: 'Inquiries deleted successfully.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to delete inquiries.',
      });
    }
  }

  @Post('event')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ description: 'Create event' })
  @ApiBody({ type: EventDto })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          return cb(null, `${uuidv4()}.${file.originalname}`);
        },
      }),
    }),
  )
  async createEvent(@Body() dto: EventDto, @UploadedFile() file: Express.Multer.File, @CurrentAdmin() admin: IAuthAdmin) {
    try {
      let path;
      if (file) {
        path = await this.cloudinaryService.uploadImage(file.path, 'event');
      }
      const newEvent = await this.adminService.createEvent(dto, admin.id, path || undefined);
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

  @Get('events')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ description: 'Get All Events' })
  async getAllEvents() {
    try {
      const events = await this.adminService.getAllEvents();
      return {
        _data: events,
        _metadata: {
          message: 'Events successfully fetched.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to fetch events.',
      });
    }
  }

  @Delete('event/:id')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ description: 'Delete event' })
  @ApiParam({ type: 'string', name: 'id' })
  async deleteEvent(@Param('id') id: string) {
    try {
      const deletedEvent = await this.adminService.deleteEvent(id);
      return {
        _data: deletedEvent,
        _metadata: {
          message: 'Event deleted successfully.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to delete event.',
      });
    }
  }
}
