import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { PostService } from '../../../../../services/post.service';
import { Post } from '../../../../../entities/post.entity';

@Resolver(() => Post)
export class PostQueryResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [Post], { name: 'post' })
  findAll() {
    return this.postService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postService.findOne(id);
  }
}
