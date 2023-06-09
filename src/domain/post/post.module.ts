import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PublicPostV1Resolvers } from './api/public/resolvers/v1';
import { PostService } from './services/post.service';

@Module({
  providers: [...PublicPostV1Resolvers, PostService, PrismaService],
})
export class PostModule {}
