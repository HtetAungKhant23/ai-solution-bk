import { Module } from '@nestjs/common';
import { CloudinaryService } from '@app/shared/upload/cloudinary.service';
import { AdminService } from '../admin/admin.service';
import { AdminController } from '../admin/admin.controller';

@Module({
  controllers: [AdminController],
  providers: [AdminService, CloudinaryService],
})
export class RoutesAdminModule {}
