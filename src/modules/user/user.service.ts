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

  async getAllRatings() {
    return this.dbService.user.findMany();
  }

  async createRating(userId: string, rating: number, description: string) {
    return this.dbService.user.update({
      where: {
        id: userId,
      },
      data: {
        rating,
        ratingDesc: description,
      },
    });
  }

  async getAllEvents() {
    return this.dbService.event.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        files: {
          select: {
            path: true,
          },
        },
      },
    });
  }
}
