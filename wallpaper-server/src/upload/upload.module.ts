import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { extname } from 'path'
import { diskStorage } from 'multer'
import { MulterModule } from '@nestjs/platform-express'
@Module({
  imports:[MulterModule.registerAsync({
    useFactory(){
      return {
        storage: diskStorage({
          destination: 'static',
          filename: (req, file, callback) => {
            const path = Date.now() + '-' + Math.round(Math.random() * 1e10) + extname(file.originalname)
            callback(null, path)
          },
        })
      }
    }
  })],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
