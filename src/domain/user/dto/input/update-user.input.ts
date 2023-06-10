import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  userName: string;

  @Field({ nullable: true })
  fullName: string;
}
