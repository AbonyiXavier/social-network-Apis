import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from '../../../../../services/user.service';
import { User } from '../../../../../entities/user.entity';
import { UsersResponseOutput } from '../../../../../dto/output/users.response.output';
import { PaginationArgs } from '../../../../../../../common/pagination/paginationArgs';
import { UserSearchByInput } from '../../../../../dto/input/user-search.input';
import { CurrentUserId } from '../../../../../../../common/decorators/currentUserId.decorator';
import { UserResponseOutput } from '../../../../../dto/output/user.response.output';

@Resolver(() => User)
export class UserQueryResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UsersResponseOutput, {
    name: 'fetchUsers',
    description: 'Fetch all users',
  })
  async fetchUsers(
    @Args({ name: 'paginationArgs', description: 'Pagination input' }) paginationArgs: PaginationArgs,
    @Args({ name: 'searchBy', description: 'search input', nullable: true }) searchBy: UserSearchByInput,
  ) {
    const [users, error] = await this.userService.fetchUsers(paginationArgs, searchBy);

    if (error) {
      throw error;
    }

    return users;
  }

  @Query(() => UserResponseOutput, {
    name: 'userMe',
    description: 'Get logged in user details',
  })
  async userMe(@CurrentUserId() userId: string) {
    const [user, error] = await this.userService.userMe(userId);

    if (error) {
      throw error;
    }

    return user;
  }
}
