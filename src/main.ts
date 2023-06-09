import { INestApplication, Logger } from '@nestjs/common';
import { createMainApp } from './app.utils';
import { AppRunMode } from './common/enums';
import { AppConfigService } from './common/config/services/app.config.service';
import { PrismaService } from './common/prisma/prisma.service';

async function bootstrap() {
  let port: number, app: INestApplication;

  if (AppRunMode.App) {
    app = await createMainApp();
    port = app.get(AppConfigService).getMainServicePort();

    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);
  }

  await app.listen(port, () => {
    Logger.log(`Service is running on port ${port}`);
  });
}
bootstrap();
