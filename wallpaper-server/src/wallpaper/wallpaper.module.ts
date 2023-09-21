import { Module } from '@nestjs/common';
import { WallpaperService } from './wallpaper.service';
import { WallpaperController } from './wallpaper.controller';

@Module({
  controllers: [WallpaperController],
  providers: [WallpaperService]
})
export class WallpaperModule {}
