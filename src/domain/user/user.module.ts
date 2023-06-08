import { Module } from '@nestjs/common';
import { PublicUserV1Resolvers } from './api/public/resolvers/v1';
import { UserService } from './services/user.service';

@Module({
  providers: [...PublicUserV1Resolvers, UserService],
})
export class UserModule {}
