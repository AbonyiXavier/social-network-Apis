import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from '../../../../../services/post.service';
import { Post } from '../../../../../entities/post.entity';
import { CreatePostInput } from '../../../../../dto/input/create-post.input';
import { UpdatePostInput } from '../../../../../dto/input/update-post.input';

@Resolver(() => Post)
export class PostMutationResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post)
  createPost(@Args('createPostInput') createPostInput: CreatePostInput) {
    return this.postService.create(createPostInput);
  }

  @Mutation(() => Post)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => Post)
  removePost(@Args('id', { type: () => Int }) id: number) {
    return this.postService.remove(id);
  }
}
