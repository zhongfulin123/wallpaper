import { Inject, Injectable } from '@nestjs/common'
import fs from 'fs/promises'
import path from 'path'
import { ConfigService } from '@nestjs/config'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
@Injectable()
export class WallpaperService {
    constructor(private config: ConfigService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
    async wallpaper() {
        const staticPath = path.join(__dirname, '../../', 'static')
        console.log(staticPath)
        try {
            const files = await fs.readdir(staticPath)
            const imageFiles = files.filter((file) => file.match(/\.(jpg|jpeg|png|gif)$/i))
            let index = null
            index = Math.floor(Math.random() * imageFiles.length)
            const value = await this.cacheManager.get('index')
            while (true) {
                if (value !== index) break
                index = Math.floor(Math.random() * imageFiles.length)
            }

            await this.cacheManager.set('index', index,0)
            return {
                url: `${this.config.get(`IMAGE_URL`)}/${imageFiles[index]}`,
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    async wallpaperList() {
        const staticPath = path.join(__dirname, '../../', 'static')
        try {
            const files = await fs.readdir(staticPath)
            const imageFiles = files.filter((file) => file.match(/\.(jpg|jpeg|png|gif)$/i)).map(item=>({
                url: `${this.config.get(`IMAGE_URL`)}/${item}`
            }))
            return {
                list: imageFiles
            }
        } catch (error) {
            throw new Error(error)
        }
    }
}
