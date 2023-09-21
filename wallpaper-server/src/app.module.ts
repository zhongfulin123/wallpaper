import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';

import { WallpaperModule } from './wallpaper/wallpaper.module';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [UploadModule,WallpaperModule,ConfigModule.forRoot({
    isGlobal: true,
  }), CacheModule.register({
    isGlobal: true
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
