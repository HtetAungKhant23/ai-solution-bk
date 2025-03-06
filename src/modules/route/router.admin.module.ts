import { Module } from '@nestjs/common';
import { adminService } from '../admin/admin.service';
import { AdminController } from '../admin/admin.controller';

@Module({
  controllers: [AdminController],
  providers: [adminService],
})
export class RoutesAdminModule {}
