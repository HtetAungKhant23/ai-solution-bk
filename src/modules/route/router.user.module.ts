import { Module } from '@nestjs/common';
import EmailService from '@app/shared/mail/mail.service';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export class RoutesUserModule {}
