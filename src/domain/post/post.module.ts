import { Module } from '@nestjs/common';
import { PublicPostV1Resolvers } from './api/public/resolvers/v1';
import { PostService } from './services/post.service';

@Module({
  providers: [...PublicPostV1Resolvers, PostService],
})
export class PostModule {}
