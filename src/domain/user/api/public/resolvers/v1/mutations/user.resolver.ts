import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UserService } from '../../../../../services/user.service';
import { User } from '../../../../../entities/user.entity';
import { UpdateUserInput } from '../../../../../dto/input/update-user.input';
import { UserResponseOutput } from '../../../../../dto/output/user.response.output';
import { CurrentUserId } from '../../../../../../../common/decorators/currentUserId.decorator';
import { UserChangePasswordInput } from '../../../../../dto/input/user-change-password.input';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@Resolver(() => User)
export class UserMutationResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserResponseOutput, {
    name: 'changePassword',
    description: 'Change user password',
  })
  async changePassword(@CurrentUserId() userId: string, @Args('input') input: UserChangePasswordInput) {
    const [user, error] = await this.userService.changePassword(userId, input);

    if (error) {
      throw error;
    }

    return user;
  }

  @Mutation(() => UserResponseOutput, {
    name: 'singleUpload',
    description: 'Single upload for user',
  })
  async singleUpload(@CurrentUserId() userId: string, @Args('file', { nullable: true, type: () => GraphQLUpload }) file: any) {
    const [user, error] = await this.userService.uploadProfilePictureUrl(userId, file);

    if (error) {
      throw error;
    }

    return user;
  }

  @Mutation(() => UserResponseOutput, {
    name: 'updateUserInfo',
    description: 'Update user info',
  })
  async updateUserInfo(@CurrentUserId() userId: string, @Args('input') input: UpdateUserInput) {
    const [user, error] = await this.userService.updateUserInfo(userId, input);

    if (error) {
      throw error;
    }

    return user;
  }
}
