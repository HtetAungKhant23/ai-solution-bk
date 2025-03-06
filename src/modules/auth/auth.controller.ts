import { BadRequestException, Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { ExceptionConstants } from "@app/core/exceptions/constants";
import { LoginDto } from "./dto/login.dto";

@ApiTags("Auth")
@Controller({version: '1'})
export class AuthController{
    constructor(private readonly authService: AuthService){}

    @Post('register')
    @ApiBody({ type: RegisterDto, description: 'Register Admin.' })
    async register(@Body() dto: RegisterDto) {
      try {
        const newAdmin = await this.authService.register(dto);
        return {
          _data: newAdmin,
          _metadata: {
            message: 'Register success.',
            statusCode: HttpStatus.CREATED,
          },
        };
      } catch (err) {
        throw new BadRequestException({
          message: err.message,
          cause: new Error(err),
          code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
          description: 'Failed to admin register',
        });
      }
    }

    @Post('login')
    @ApiBody({ type: LoginDto, description: 'Admin Login.' })
    async login(@Body() dto: LoginDto) {
      try {
        const token: string = await this.authService.login(dto);
        return {
          _data: { token },
          _metadata: {
            message: 'Admin login success.',
            statusCode: HttpStatus.OK,
          },
        };
      } catch (err) {
        throw new BadRequestException({
          message: err.message,
          cause: new Error(err),
          code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
          description: 'Failed to login',
        });
      }
    }
}