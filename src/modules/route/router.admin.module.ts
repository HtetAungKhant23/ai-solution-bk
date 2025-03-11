import { Module } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { AdminController } from '../admin/admin.controller';
import { CloudinaryService } from '@app/shared/upload/cloudinary.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, CloudinaryService],
})
export class RoutesAdminModule {}
