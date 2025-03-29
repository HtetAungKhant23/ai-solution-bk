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
    return this.dbService.rating.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createRating(name: string, rating: number, feedback: string) {
    return this.dbService.rating.create({
      data: {
        ratedBy: name,
        rate: rating,
        feedback,
      },
    });
  }

  async getAllEvents() {
    return this.dbService.event.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        startDate: 'asc',
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

  async getAllBlogs() {
    return this.dbService.blog.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
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
