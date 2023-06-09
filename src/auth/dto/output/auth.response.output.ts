import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../../domain/user/entities/user.entity';

@ObjectType()
export class AuthResponseOutput {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}
