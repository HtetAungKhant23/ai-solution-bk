import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { PaginationDto } from '@app/core/dtos/pagination.dto';
import { EventDto } from './dto/event.dto';
import { AdminAuthGuard } from '../auth/guard/admin.guard';
import { AdminService } from './admin.service';
import { UserInquiriesDto } from './dto/user-inquires.dto';
import { UserInquiriesTotalDto } from './dto/user-inquiries-total.dto';
import { UserInquiriesExcelDto } from './dto/user-inquiries-excel.dto';
import { BlogDto } from './dto/blog.dto';

@ApiTags('Admin')
@Controller({ version: '1' })
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('ratings')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ description: 'Get All Ratings' })
  async getAllRatings(@Query() dto: PaginationDto, @Pagination() paginate: IPagination) {
    try {
      const data = await this.adminService.getAllRatings(paginate);
      return {
        _data: data,
        _metadata: {
          message: 'Ratings successfully fetched.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to fetch ratings.',
      });
    }
  }

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

  @Put('user-inqury/:id')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ description: 'Update User Inquiries Seen Status' })
  @ApiParam({ type: 'string', name: 'id' })
  async updateUserInqurySeenStatus(@Param('id') userId: string) {
    try {
      const result = await this.adminService.updateUserInqurySeenStatus(userId);
      return {
        _data: result,
        _metadata: {
          message: 'User inqury successfully change to read.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to change read user inqury.',
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

  @Post('user-inquries/excel')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ description: 'Export User Inquiries Excel' })
  async excelExportUserInquries(@Query() dto: UserInquiriesExcelDto) {
    try {
      const data = await this.adminService.excelExportUserInquries(dto);
      const path = await this.cloudinaryService.uploadFile(data.excelFileName, data.buffer, 'inquiries');
      return {
        _data: path,
        _metadata: {
          message: 'User inquries excel successfully exported.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to export user inquries excel.',
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
  async getAllEvents(@Query() dto: PaginationDto, @Pagination() paginate: IPagination) {
    try {
      const data = await this.adminService.getAllEvents(paginate);
      return {
        _data: data,
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

  @Post('blog')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ description: 'Create event' })
  @ApiBody({ type: BlogDto })
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
  async createBlog(@Body() dto: BlogDto, @UploadedFile() file: Express.Multer.File, @CurrentAdmin() admin: IAuthAdmin) {
    try {
      let path;
      if (file) {
        path = await this.cloudinaryService.uploadImage(file.path, 'blog');
      }
      console.log(path);
      const newBlog = await this.adminService.createBlog(dto, admin.id, path || undefined);
      return {
        _data: newBlog,
        _metadata: {
          message: 'Blog saved successfully.',
          statusCode: HttpStatus.CREATED,
        },
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to save new blog.',
      });
    }
  }

  @Get('blogs')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ description: 'Get All Blogs' })
  async getAllBlogs(@Query() dto: PaginationDto, @Pagination() paginate: IPagination) {
    try {
      const data = await this.adminService.getAllBlogs(paginate);
      return {
        _data: data,
        _metadata: {
          message: 'Blogs successfully fetched.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to fetch blogs.',
      });
    }
  }

  @Delete('blog/:id')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ description: 'Delete Blog' })
  @ApiParam({ type: 'string', name: 'id' })
  async deleteBlog(@Param('id') id: string) {
    try {
      const deletedBlog = await this.adminService.deleteBlog(id);
      return {
        _data: deletedBlog,
        _metadata: {
          message: 'Blog deleted successfully.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to delete blog.',
      });
    }
  }
}
