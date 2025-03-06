import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor(private readonly dbService: PrismaService) {}

  async getMe(id: string) {
    return this.dbService.admin.findUnique({
      where: {
        id,
      },
    });
  }

  async getAllUserInquries() {
    return this.dbService.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
