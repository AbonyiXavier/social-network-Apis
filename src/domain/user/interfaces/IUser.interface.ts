import { HttpException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationArgs } from '../../../common/pagination/paginationArgs';
import { UpdateUserInput } from '../dto/input/update-user.input';
import { UserChangePasswordInput } from '../dto/input/user-change-password.input';
import { UserSearchByInput } from '../dto/input/user-search.input';
import { UserResponseOutput } from '../dto/output/user.response.output';
import { UsersResponseOutput } from '../dto/output/users.response.output';
import { IUser } from '../types/user.type';
export interface IUserService {
  fetchUsers(paginationArgs: PaginationArgs, searchBy: UserSearchByInput): Promise<[UsersResponseOutput, HttpException]>;
  userMe(userId: string): Promise<[UserResponseOutput, HttpException]>;
  changePassword(userId: string, userChangePasswordInput: UserChangePasswordInput): Promise<[UserResponseOutput, HttpException]>;
  updateUserInfo(userId: string, updateUserInput: UpdateUserInput): Promise<[UserResponseOutput, HttpException]>;
  uploadProfilePictureUrl(userId: string, file: any): Promise<[UserResponseOutput, HttpException]>;
  getPaginationMetadata(where: Prisma.PostWhereInput, offset: number, limit: number);
  getUserByIdAndValidateOwnership(userId: string): Promise<IUser>;
}
