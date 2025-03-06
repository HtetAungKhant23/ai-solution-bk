import { BadRequestException, Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@ApiTags('User')
@Controller({ version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ description: 'Create user via contact us' })
  @ApiBody({ type: UserDto })
  async create(@Body() dto: UserDto) {
    try {
      const newUser = await this.userService.create(dto);
      return {
        _data: newUser,
        _metadata: {
          message: 'User saved successfully.',
          statusCode: HttpStatus.CREATED,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to save new user.',
      });
    }
  }
}
