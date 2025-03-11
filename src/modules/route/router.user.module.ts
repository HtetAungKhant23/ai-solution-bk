import { Module } from '@nestjs/common';
import EmailService from '@app/shared/mail/mail.service';
import { ChatbotService } from '@app/shared/chatbot/chatbot.service';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, EmailService, ChatbotService],
})
export class RoutesUserModule {}
