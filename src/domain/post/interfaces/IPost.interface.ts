import { HttpException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationArgs } from '../../../common/pagination/paginationArgs';
import { CreatePostInput } from '../dto/input/create-post.input';
import { PostSearchByInput } from '../dto/input/post-search.input';
import { UpdatePostInput } from '../dto/input/update-post.input';
import { PostResponseOutput } from '../dto/output/post.response.output';
import { PostsResponseOutput } from '../dto/output/posts.response.output';

export interface IPostService {
  createPost(userId: string, input: CreatePostInput): Promise<[PostResponseOutput, HttpException]>;
  fetchPosts(paginationArgs: PaginationArgs, searchBy: PostSearchByInput): Promise<[PostsResponseOutput, HttpException]>;
  fetchPost(userId: string, postId: string): Promise<[PostResponseOutput, HttpException]>;
  fetchPostsByAuthor(authorId: string, paginationArgs: PaginationArgs, searchBy: PostSearchByInput): Promise<[PostsResponseOutput, HttpException]>;
  softDeletePostByAuthor(userId: string, postId: string): Promise<[PostResponseOutput, HttpException]>;
  updatePostByAuthor(userId: string, updatePostInput: UpdatePostInput): Promise<[PostResponseOutput, HttpException]>;
  getPaginationMetadata(where: Prisma.PostWhereInput, offset: number, limit: number);
}
