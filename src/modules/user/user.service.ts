import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly dbService: PrismaService) {}

  async create(dto: UserDto) {
    return this.dbService.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        companyName: dto.companyName,
        country: dto.country,
        jobTitle: dto.jobTitle,
        jobDetail: dto.jobDetail,
      },
    });
  }
}
