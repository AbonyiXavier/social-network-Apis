import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PostService } from '../../../../../services/post.service';
import { Post } from '../../../../../entities/post.entity';
import { CreatePostInput } from '../../../../../dto/input/create-post.input';
import { PostResponseOutput } from '../../../../../dto/output/post.response.output';
import { CurrentUserId } from '../../../../../../../common/decorators/currentUserId.decorator';
import { UpdatePostInput } from '../../../../../dto/input/update-post.input';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@Resolver(() => Post)
export class PostMutationResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => PostResponseOutput, {
    name: 'createPost',
    description: 'Create a post',
  })
  async createPost(
    @CurrentUserId() userId: string,
    @Args('input') input: CreatePostInput,
    @Args('file', { nullable: true, type: () => GraphQLUpload }) file: any,
  ) {
    const [post, error] = await this.postService.createPost(userId, input, file);

    if (error) {
      throw error;
    }

    return post;
  }

  @Mutation(() => PostResponseOutput, {
    name: 'updatePost',
    description: 'Update a post',
  })
  async updatePost(
    @CurrentUserId() userId: string,
    @Args('input') input: UpdatePostInput,
    @Args('file', { nullable: true, type: () => GraphQLUpload }) file: any,
  ) {
    const [post, error] = await this.postService.updatePostByAuthor(userId, input, file);

    if (error) {
      throw error;
    }

    return post;
  }

  @Mutation(() => PostResponseOutput, {
    name: 'deletePost',
    description: 'Delete a post',
  })
  async deletePost(@CurrentUserId() userId: string, @Args('id') id: string) {
    const [post, error] = await this.postService.softDeletePostByAuthor(userId, id);

    if (error) {
      throw error;
    }

    return post;
  }
}
