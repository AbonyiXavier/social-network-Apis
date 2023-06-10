import { Resolver, Query, Args } from '@nestjs/graphql';
import { PostService } from '../../../../../services/post.service';
import { Post } from '../../../../../entities/post.entity';
import { PostResponseOutput } from '../../../../../dto/output/post.response.output';
import { PostsResponseOutput } from '../../../../../dto/output/posts.response.output';
import { PostSearchByInput } from '../../../../../dto/input/post-search.input';
import { PaginationArgs } from '../../../../../../../common/pagination/paginationArgs';
import { CurrentUserId } from '../../../../../../../common/decorators/currentUserId.decorator';

@Resolver(() => Post)
export class PostQueryResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => PostsResponseOutput, {
    name: 'posts',
    description: 'Fetch list of posts',
  })
  async fetchPosts(
    @Args({ name: 'paginationArgs', description: 'Pagination input' }) paginationArgs: PaginationArgs,
    @Args({ name: 'searchBy', description: 'search input', nullable: true }) searchBy: PostSearchByInput,
  ) {
    const [posts, error] = await this.postService.fetchPosts(paginationArgs, searchBy);

    if (error) {
      throw error;
    }

    return posts;
  }

  @Query(() => PostResponseOutput, {
    name: 'post',
    description: 'Fetch a post',
  })
  async fetchPost(@CurrentUserId() userId: string, @Args('id') id: string) {
    const [post, error] = await this.postService.fetchPost(userId, id);

    if (error) {
      throw error;
    }

    return post;
  }

  @Query(() => PostsResponseOutput, {
    name: 'fetchPostsByAuthor',
    description: 'Fetch list of posts by author',
  })
  async fetchPostsByAuthor(
    @CurrentUserId() userId: string,
    @Args({ name: 'paginationArgs', description: 'Pagination input' }) paginationArgs: PaginationArgs,
    @Args({ name: 'searchBy', description: 'search input', nullable: true }) searchBy: PostSearchByInput,
  ) {
    const [posts, error] = await this.postService.fetchPostsByAuthor(userId, paginationArgs, searchBy);

    if (error) {
      throw error;
    }

    return posts;
  }
}
