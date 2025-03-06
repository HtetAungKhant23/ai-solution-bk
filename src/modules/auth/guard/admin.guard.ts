import { ExceptionConstants } from '@app/core/exceptions/constants';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminAuthGuard extends AuthGuard('admin') {
  private readonly logger = new Logger(AdminAuthGuard.name);

  handleRequest(err: any, admin: any) {
    if (err || !admin) {
      this.logger.error({
        message: 'AdminAuthGuard: Invalid token',
        error: err || 'Invalid token (no admin)',
      });
      throw new BadRequestException({
        message: err?.message || 'Invalid token',
        code: ExceptionConstants.UnauthorizedCodes.ACCESS_TOKEN_EXPIRED,
        description: 'Invalid or Expire token',
      });
    }
    
    return admin;
  }
}