import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from '../../../../../services/user.service';
import { User } from '../../../../../entities/user.entity';
import { CreateUserInput } from '../../../../../dto/input/create-user.input';
import { UpdateUserInput } from '../../../../../dto/input/update-user.input';

@Resolver(() => User)
export class UserMutationResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }
}
