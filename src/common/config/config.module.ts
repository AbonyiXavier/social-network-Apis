import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule as Config } from '@nestjs/config';
import { AppConfigService } from './services/app.config.service';
import { ConfigHelper } from './helper/config.helper';

@Module({
  imports: [
    HttpModule,
    Config.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [AppConfigService, ConfigHelper],
  exports: [AppConfigService],
})
export class ConfigModule {}
