import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field()
  id: string;

  @Field()
  userName: string;

  @Field()
  fullName: string;

  @Field()
  profilePictureUrl: string;
}
