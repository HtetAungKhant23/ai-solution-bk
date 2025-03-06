import { Module } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { AdminController } from '../admin/admin.controller';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class RoutesAdminModule {}
