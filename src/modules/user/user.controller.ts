import { BadRequestException, Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import EmailService from '@app/shared/mail/mail.service';
import { contactUsTemplate } from '@app/shared/mail/template/contact-us.template';
import { ChatbotService } from '@app/shared/chatbot/chatbot.service';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { RatingDto } from './dto/rating.dto';
import { ChatDto } from './dto/chat.dto';

@ApiTags('User')
@Controller({ version: '1' })
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: EmailService,
    private readonly chatbotService: ChatbotService,
  ) {}

  @Post()
  @ApiOperation({ description: 'Create user via contact us' })
  @ApiBody({ type: UserDto })
  async create(@Body() dto: UserDto) {
    try {
      const newUser = await this.userService.create(dto);
      await this.mailService.sendMail({
        from: 'spendwise@gmail.com',
        to: dto.email,
        subject: 'Contact Confirmation',
        html: contactUsTemplate(newUser.name),
      });
      return {
        _data: newUser,
        _metadata: {
          message: 'User saved successfully.',
          statusCode: HttpStatus.CREATED,
        },
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to save new user.',
      });
    }
  }

  @Get('ratings')
  @ApiOperation({ description: 'Get all user ratings' })
  async getAllRatings() {
    try {
      const userRatings = await this.userService.getAllRatings();
      return {
        _data: userRatings,
        _metadata: {
          message: 'All ratings successfully fetched.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to get all user ratings.',
      });
    }
  }

  @Post('rating')
  @ApiOperation({ description: 'Give rating' })
  @ApiBody({ type: RatingDto })
  async createRating(@Body() dto: RatingDto) {
    try {
      const rating = await this.userService.createRating(dto.name, dto.rating, dto.feedback);
      return {
        _data: rating,
        _metadata: {
          message: 'Rating saved successfully.',
          statusCode: HttpStatus.CREATED,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to save new rating.',
      });
    }
  }

  @Get('events')
  @ApiOperation({ description: 'Get All Events' })
  async getAllEvents() {
    try {
      const events = await this.userService.getAllEvents();
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

  @Get('blogs')
  @ApiOperation({ description: 'Get All Blogs' })
  async getAllBlogs() {
    try {
      const blogs = await this.userService.getAllBlogs();
      return {
        _data: blogs,
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

  @Post('ask')
  @ApiOperation({ description: 'User ask to chat bot' })
  @ApiBody({ type: ChatDto })
  async askChatbot(@Body() dto: ChatDto) {
    const response = await this.chatbotService.getChatbotResponse(dto.message);
    console.log({ response });
    return { reply: response };
  }
}
