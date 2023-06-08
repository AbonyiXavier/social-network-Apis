import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  userName: string;

  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field()
  dateOfBirth: Date;
}
