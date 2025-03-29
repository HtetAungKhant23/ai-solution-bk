import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      secure: true,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(filePath: string, folderName: 'event' | 'blog'): Promise<UploadApiErrorResponse | UploadApiResponse> {
    const res = await cloudinary.uploader.upload(filePath, { folder: `ai-solution/${folderName}` }).catch((err) => {
      console.log(err);
      return err;
    });

    return res.secure_url;
  }

  async uploadFile(filePath: string, buffer: Buffer, folderName: 'inquiries') {
    const tempFilePath = path.join(__dirname, `${filePath}.xlsx`);

    try {
      await writeFile(tempFilePath, buffer);

      const res = await cloudinary.uploader.upload(tempFilePath, {
        folder: `ai-solution/${folderName}`,
        resource_type: 'raw',
      });

      return res.secure_url;
    } finally {
      await unlink(tempFilePath);
    }
  }
}
