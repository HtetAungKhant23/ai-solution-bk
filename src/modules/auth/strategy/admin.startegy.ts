import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private readonly dbService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.ADMIN_SECRET_KEY || 'barnyarhehe',
    });
  }

  async validate(payload: { id: string; email: string }) {
    const admin = await this.dbService.admin.findUnique({ where: { id: payload.id } });

    if (!admin) {
      throw new Error('Invalid token.');
    }
    return { id: payload.id, email: payload.email };
  }
}
