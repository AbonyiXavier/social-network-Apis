import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationArgs } from '../../../common/pagination/paginationArgs';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { UpdateUserInput } from '../dto/input/update-user.input';
import { UserChangePasswordInput } from '../dto/input/user-change-password.input';
import { UserSearchByInput } from '../dto/input/user-search.input';
import { UserResponseOutput } from '../dto/output/user.response.output';
import { UsersResponseOutput } from '../dto/output/users.response.output';
import * as argon from 'argon2';
import { IUser } from '../types/user.type';
import { IUserService } from '../interfaces/IUser.interface';

import { picturePrefix } from '../utilities/constant';
import { uploadFile } from '../../../common/utilities/utilities';

@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async fetchUsers(paginationArgs: PaginationArgs, searchBy: UserSearchByInput): Promise<[UsersResponseOutput, HttpException]> {
    try {
      const { limit, offset } = paginationArgs;
      const { searchTerm } = searchBy;

      let where: Prisma.UserWhereInput = {};

      if (searchTerm) {
        where = {
          OR: [{ userName: { contains: searchTerm, mode: 'insensitive' } }, { fullName: { contains: searchTerm, mode: 'insensitive' } }],
        };
      }

      const { calculatedOffset, count } = await this.getPaginationMetadata(where, offset, limit);

      const users = await this.prisma.user.findMany({
        include: { posts: true },
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
        users,
      };

      return [result, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  async userMe(userId: string): Promise<[UserResponseOutput, HttpException]> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return [user, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  async changePassword(userId: string, userChangePasswordInput: UserChangePasswordInput): Promise<[UserResponseOutput, HttpException]> {
    try {
      const { oldPassword, newPassword } = userChangePasswordInput;

      const user = await this.getUserByIdAndValidateOwnership(userId);

      // To avoid using oldPassword when changing
      if (oldPassword === newPassword) {
        throw new BadRequestException(`Please you can't use your old password, please change`);
      }

      const isPasswordMatch = await argon.verify(user?.password, oldPassword);

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid credentials provided');
      }

      const hashedPassword = await argon.hash(newPassword);

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      const [response] = await this.userMe(userId);

      return [response, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  async uploadProfilePictureUrl(userId: string, file: any): Promise<[UserResponseOutput, HttpException]> {
    try {
      if (file) {
        // Handle file upload
        const upload = await uploadFile(file);

        // Perform the update operation
        if (upload?.filename) {
          await this.prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              profilePictureUrl: `${picturePrefix}${upload.filename}`,
            },
          });
        }
      }

      const [response] = await this.userMe(userId);

      return [response, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  async updateUserInfo(userId: string, updateUserInput: UpdateUserInput): Promise<[UserResponseOutput, HttpException]> {
    try {
      const { userName, fullName } = updateUserInput;

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          userName,
          fullName,
        },
      });

      const [response] = await this.userMe(userId);

      return [response, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  public async getPaginationMetadata(where: Prisma.PostWhereInput, offset: number, limit: number) {
    const count = await this.prisma.user.count({ where });

    let calculatedOffset = offset;
    if (offset === -1) {
      calculatedOffset = Math.max(count - limit, 0);
    }
    return { calculatedOffset, count };
  }

  async getUserByIdAndValidateOwnership(userId: string): Promise<IUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: { posts: true },
    });

    if (!user || user.id !== userId) {
      throw new ForbiddenException('Wrong password combination');
    }

    return user;
  }
}
