import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from './config/config.module';

@Global()
@Module({
  imports: [ConfigModule, HttpModule],
  providers: [],
  exports: [ConfigModule, HttpModule],
})
export class CommonModule {}
