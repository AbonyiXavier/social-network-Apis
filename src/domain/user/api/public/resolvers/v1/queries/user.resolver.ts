import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UserService } from '../../../../../services/user.service';
import { User } from '../../../../../entities/user.entity';

@Resolver(() => User)
export class UserQueryResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'user' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }
}
