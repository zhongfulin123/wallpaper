import { Controller,Get } from '@nestjs/common';
import { WallpaperService } from './wallpaper.service';

@Controller('wallpaper')
export class WallpaperController {
  constructor(private readonly wallpaperService: WallpaperService) {}
  @Get()
  findOnE() {
    return this.wallpaperService.wallpaper();
  }
  @Get('/all')
  findAll() {
    return this.wallpaperService.wallpaperList();
  }
}
