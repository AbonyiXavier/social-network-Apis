import { ForbiddenException, HttpException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationArgs } from '../../../common/pagination/paginationArgs';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { uploadFile } from '../../../common/utilities/utilities';
import { picturePrefix } from '../../user/utilities/constant';
import { CreatePostInput } from '../dto/input/create-post.input';
import { PostSearchByInput } from '../dto/input/post-search.input';
import { UpdatePostInput } from '../dto/input/update-post.input';
import { PostResponseOutput } from '../dto/output/post.response.output';
import { PostsResponseOutput } from '../dto/output/posts.response.output';
import { IPostService } from '../interfaces/IPost.interface';

@Injectable()
export class PostService implements IPostService {
  private readonly logger = new Logger(PostService.name);
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  async createPost(userId: string, input: CreatePostInput, file: any): Promise<[PostResponseOutput, HttpException]> {
    try {
      if (file) {
        // Handle file upload
        const upload = await uploadFile(file);

        // Perform the create operation
        if (upload?.filename) {
          const post = await this.prisma.post.create({
            data: {
              title: input.title,
              content: input.content,
              picture: `${picturePrefix}${upload.filename}`,
              author: { connect: { id: userId } },
            },
            include: { author: true },
          });

          return [post, null];
        }
      }

      const post = await this.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          picture: '',
          author: { connect: { id: userId } },
        },
        include: { author: true },
      });

      return [post, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  async fetchPosts(paginationArgs: PaginationArgs, searchBy: PostSearchByInput): Promise<[PostsResponseOutput, HttpException]> {
    try {
      const { limit, offset } = paginationArgs;
      const { searchTerm } = searchBy;

      let where: Prisma.PostWhereInput = {};

      if (searchTerm) {
        where = {
          OR: [{ title: { contains: searchTerm, mode: 'insensitive' } }, { content: { contains: searchTerm, mode: 'insensitive' } }],
        };
      }

      const { calculatedOffset, count } = await this.getPaginationMetadata(where, offset, limit);

      const posts = await this.prisma.post.findMany({
        include: { author: true },
        take: limit,
        skip: calculatedOffset,
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const totalPages = Math.ceil(count / limit);
      const nextPage = offset + limit < count;
      const currentPage = Math.floor(offset / limit) + 1;

      const result = {
        totalCount: count,
        totalPages,
        nextPage,
        currentPage,
        posts,
      };

      return [result, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  async fetchPost(userId: string, postId: string): Promise<[PostResponseOutput, HttpException]> {
    try {
      const post = await this.prisma.post.findUnique({
        where: {
          id: postId,
        },
        include: { author: true },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.authorId !== userId) {
        throw new ForbiddenException('Unauthorized.');
      }

      return [post, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  async fetchPostsByAuthor(
    authorId: string,
    paginationArgs: PaginationArgs,
    searchBy: PostSearchByInput,
  ): Promise<[PostsResponseOutput, HttpException]> {
    try {
      const { limit, offset } = paginationArgs;
      const { searchTerm } = searchBy;

      let where: Prisma.PostWhereInput = {
        authorId,
      };

      if (searchTerm) {
        where = {
          OR: [{ title: { contains: searchTerm, mode: 'insensitive' } }, { content: { contains: searchTerm, mode: 'insensitive' } }],
        };
      }

      const { calculatedOffset, count } = await this.getPaginationMetadata(where, offset, limit);

      const posts = await this.prisma.post.findMany({
        include: { author: true },
        take: limit,
        skip: calculatedOffset,
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const totalPages = Math.ceil(count / limit);
      const nextPage = offset + limit < count;
      const currentPage = Math.floor(offset / limit) + 1;

      const result = {
        totalCount: count,
        totalPages,
        nextPage,
        currentPage,
        posts,
      };

      return [result, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  async softDeletePostByAuthor(userId: string, postId: string): Promise<[PostResponseOutput, HttpException]> {
    try {
      const [post, error] = await this.fetchPost(userId, postId);

      if (error) {
        throw error;
      }

      await this.prisma.post.delete({
        where: {
          id: postId,
        },
      });

      return [post, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  async updatePostByAuthor(userId: string, updatePostInput: UpdatePostInput, file: any): Promise<[PostResponseOutput, HttpException]> {
    try {
      const { id: postId, title, content } = updatePostInput;

      const [fetchPost, error] = await this.fetchPost(userId, postId);

      this.logger.log(fetchPost);

      if (error) {
        throw error;
      }

      if (file) {
        // Handle file upload
        const upload = await uploadFile(file);

        // Perform the update operation
        if (upload?.filename) {
          await this.prisma.post.update({
            where: {
              id: postId,
            },
            data: {
              title,
              content,
              picture: `${picturePrefix}${upload.filename}`,
            },
          });

          const [post] = await this.fetchPost(userId, postId);

          return [post, null];
        }
      }
      await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          title,
          content,
        },
      });

      const [post] = await this.fetchPost(userId, postId);

      return [post, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  public async getPaginationMetadata(where: Prisma.PostWhereInput, offset: number, limit: number) {
    const count = await this.prisma.post.count({ where });

    let calculatedOffset = offset;
    if (offset === -1) {
      calculatedOffset = Math.max(count - limit, 0);
    }
    return { calculatedOffset, count };
  }
}
