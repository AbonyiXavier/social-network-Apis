import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class Post {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  picture: string;

  @Field()
  authorId: string;

  @Field()
  author: User;
}
