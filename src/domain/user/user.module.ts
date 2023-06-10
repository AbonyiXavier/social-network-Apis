import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PublicUserV1Resolvers } from './api/public/resolvers/v1';
import { UserService } from './services/user.service';

@Module({
  providers: [...PublicUserV1Resolvers, UserService, JwtService, PrismaService],
})
export class UserModule {}
