import { Module } from '@nestjs/common';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import EmailService from '@app/shared/mail/mail.service';

@Module({
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export class RoutesUserModule {}
