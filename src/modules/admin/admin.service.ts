import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { EVENT_STATUS } from '@prisma/client';
import { IPagination } from '@app/core/decorators/pagination.decorators';
import { excelExport } from '@app/utils/excel';
import { EventDto } from './dto/event.dto';
import { UserInquiriesDto } from './dto/user-inquires.dto';
import { UserInquiriesTotalDto } from './dto/user-inquiries-total.dto';
import { UserInquiriesExcelDto } from './dto/user-inquiries-excel.dto';
import { BlogDto } from './dto/blog.dto';

@Injectable()
export class AdminService {
  constructor(private readonly dbService: PrismaService) {}

  async getAllRatings({ limit, offset }: IPagination) {
    const total = await this.dbService.rating.count({});
    const data = await this.dbService.rating.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
    return {
      total,
      data,
    };
  }

  async getMe(id: string) {
    return this.dbService.admin.findUnique({
      where: {
        id,
      },
    });
  }

  async updateUserInqurySeenStatus(userId: string) {
    return this.dbService.user.update({
      where: {
        id: userId,
      },
      data: {
        seen: true,
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

  async excelExportUserInquries(dto: UserInquiriesExcelDto) {
    const seen = dto.type === 'seen';

    const inquiries = await this.dbService.user.findMany({
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
    });

    const columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Email', key: 'email', width: 20 },
      { header: 'Country', key: 'country', width: 20 },
      { header: 'Company Name', key: 'companyName', width: 20 },
      { header: 'Job Title', key: 'jobTitle', width: 20 },
      { header: 'Job Detail', key: 'jobDetail', width: 30 },
      { header: 'Date', key: 'createdAt', width: 20 },
    ];

    const rows: {
      name: string;
      phone: string;
      email: string;
      country: string;
      companyName: string;
      jobTitle: string;
      jobDetail: string;
      createdAt: string;
    }[] = [];

    for (let i = 0; i < inquiries.length; i += 1) {
      const inquiry = inquiries[i];
      rows.push({
        name: inquiry?.name || '',
        phone: inquiry?.phone || '',
        email: inquiry?.email || '',
        country: inquiry?.country || '',
        companyName: inquiry?.companyName || '',
        jobTitle: inquiry?.jobTitle || '',
        jobDetail: inquiry?.jobDetail || '',
        createdAt: dayjs(inquiry?.createdAt?.toUTCString()).add(6, 'hour').add(30, 'minute').format('YYYY-MM-DD HH:mm A') || '',
      });
    }

    const { buffer, excelFileName } = await excelExport(columns, rows, 'User Inquiries Excel');

    return { buffer, excelFileName };
  }

  async deletedInquires(id: string) {
    return this.dbService.user.delete({
      where: {
        id,
      },
    });
  }

  async createEvent(dto: EventDto, creatorId: string, imgPath: any) {
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

  async getAllEvents({ limit, offset }: IPagination) {
    const total = await this.dbService.event.count({
      where: {
        isDeleted: false,
      },
      orderBy: {
        startDate: 'asc',
      },
      take: limit,
      skip: offset,
    });

    const data = await this.dbService.event.findMany({
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
      take: limit,
      skip: offset,
    });

    return {
      total,
      data,
    };
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

  async createBlog(dto: BlogDto, creatorId: string, imgPath: any) {
    return this.dbService.blog.create({
      data: {
        title: dto.title,
        body: dto.body,
        createdById: creatorId,
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

  async getAllBlogs({ limit, offset }: IPagination) {
    const total = await this.dbService.blog.count({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: limit,
      skip: offset,
    });
    const data = await this.dbService.blog.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        files: {
          select: {
            path: true,
          },
        },
      },
      take: limit,
      skip: offset,
    });
    return {
      total,
      data,
    };
  }

  async deleteBlog(id: string) {
    return this.dbService.blog.update({
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
