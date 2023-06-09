import { Field, ObjectType } from '@nestjs/graphql';
import { PostResponseOutput } from './post.response.output';

@ObjectType()
export class PostsResponseOutput {
  @Field(() => Number, { name: 'totalCount', description: 'Total Count of results', defaultValue: 0 })
  totalCount: number;

  @Field(() => Number, { name: 'totalPages', description: 'Total Pages of results', defaultValue: 0 })
  totalPages: number;

  @Field(() => Number, { name: 'currentPage', description: 'Current page number starting 0', defaultValue: 0 })
  currentPage: number;

  @Field({ name: 'nextPage', description: 'boolean flag to indicate if more pages exists', defaultValue: false })
  nextPage: boolean;

  @Field(() => [PostResponseOutput], { name: 'posts', description: 'Array of posts output', defaultValue: [] })
  posts: PostResponseOutput[];
}
