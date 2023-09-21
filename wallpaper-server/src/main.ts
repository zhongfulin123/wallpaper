import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { TranformInterceptor } from './tranform/tranform.interceptor';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useStaticAssets('static', {prefix: '/static'})
  app.enableCors()
  app.useGlobalInterceptors(new TranformInterceptor())
  await app.listen(8080);
}
bootstrap();
