import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { EVENT_STATUS } from '@prisma/client';
import { EventDto } from './dto/event.dto';

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

  async createEvent(dto: EventDto, creatorId: string) {
    return this.dbService.event.create({
      data: {
        name: dto.name,
        detail: dto.detail,
        startDate: new Date(dto.startDate),
        endDate: dayjs(dto.endDate).endOf('d').toISOString(),
        createdById: creatorId,
        organization: dto.organization,
        status: await this.getEventStatusViaDate(dto.startDate, dayjs(dto.endDate).endOf('d').toDate()),
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
