import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminStrategy } from '../auth/strategy/admin.startegy';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, AdminStrategy],
})
export class RoutesAuthModule {}