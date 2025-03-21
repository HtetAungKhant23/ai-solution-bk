import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { EVENT_STATUS } from '@prisma/client';
import { IPagination } from '@app/core/decorators/pagination.decorators';
import { EventDto } from './dto/event.dto';
import { UserInquiriesDto } from './dto/user-inquires.dto';
import { UserInquiriesTotalDto } from './dto/user-inquiries-total.dto';

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

  async getAllUserInquriesTotal(dto: UserInquiriesTotalDto) {
    const [total, seen, unSeen] = await Promise.all([
      this.dbService.user.count({
        where: {
          ...(dto?.startDate && {
            createdAt: {
              gte: dayjs(dto.startDate).toISOString(),
              lte: dayjs(dto.endDate).endOf('date').toISOString(),
            },
          }),
        },
      }),
      this.dbService.user.count({
        where: {
          seen: true,
          ...(dto?.startDate && {
            createdAt: {
              gte: dayjs(dto.startDate).toISOString(),
              lte: dayjs(dto.endDate).endOf('date').toISOString(),
            },
          }),
        },
      }),
      this.dbService.user.count({
        where: {
          seen: false,
          ...(dto?.startDate && {
            createdAt: {
              gte: dayjs(dto.startDate).toISOString(),
              lte: dayjs(dto.endDate).endOf('date').toISOString(),
            },
          }),
        },
      }),
    ]);

    console.log(total, seen, unSeen);

    return {
      total,
      seen,
      unSeen,
    };
  }

  async getAllUserInquries(dto: UserInquiriesDto, { limit, offset }: IPagination) {
    const seen = dto.type === 'seen';

    const total = await this.dbService.user.count({
      where: {
        ...(dto.type === 'all' ? {} : { seen }),
        ...(dto?.startDate && {
          createdAt: {
            gte: dayjs(dto.startDate).toISOString(),
            lte: dayjs(dto.endDate).endOf('date').toISOString(),
          },
        }),
      },
    });

    const data = await this.dbService.user.findMany({
      where: {
        ...(dto.type === 'all' ? {} : { seen }),
        country: {
          contains: dto.search,
          mode: 'insensitive',
        },
        ...(dto?.startDate && {
          createdAt: {
            gte: dayjs(dto.startDate).toISOString(),
            lte: dayjs(dto.endDate).endOf('date').toISOString(),
          },
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return {
      data,
      total,
    };
  }

  async deletedInquires(id: string) {
    return this.dbService.user.delete({
      where: {
        id,
      },
    });
  }

  async createEvent(dto: EventDto, creatorId: string, imgPath: any) {
    console.log({ imgPath });
    return this.dbService.event.create({
      data: {
        name: dto.name,
        detail: dto.detail,
        startDate: new Date(dto.startDate),
        endDate: dayjs(dto.endDate).endOf('d').toISOString(),
        createdById: creatorId,
        organization: dto.organization,
        status: await this.getEventStatusViaDate(dto.startDate, dayjs(dto.endDate).endOf('d').toDate()),
        ...(imgPath && {
          files: {
            create: {
              path: imgPath,
            },
          },
        }),
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

  async deleteEvent(id: string) {
    return this.dbService.event.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  private async getEventStatusViaDate(startDate: Date, endDate: Date): Promise<EVENT_STATUS> {
    const isOngoing = dayjs().isAfter(startDate) && dayjs().isBefore(endDate);
    const isPrevious = dayjs().isAfter(endDate);

    if (isOngoing) {
      return EVENT_STATUS.ONGOING;
    }
    if (isPrevious) {
      return EVENT_STATUS.PREVIOUS;
    }

    return EVENT_STATUS.UPCOMING;
  }
}
