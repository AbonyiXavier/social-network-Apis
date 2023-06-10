import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UserService } from '../../../../../services/user.service';
import { User } from '../../../../../entities/user.entity';
import { UpdateUserInput } from '../../../../../dto/input/update-user.input';
import { UserResponseOutput } from '../../../../../dto/output/user.response.output';
import { CurrentUserId } from '../../../../../../../common/decorators/currentUserId.decorator';
import { UserChangePasswordInput } from '../../../../../dto/input/user-change-password.input';

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
}
