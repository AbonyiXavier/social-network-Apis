import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { PublicAuthV1Resolvers } from './api/public/resolvers/v1';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  providers: [...PublicAuthV1Resolvers, AuthService, JwtService, PrismaService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
