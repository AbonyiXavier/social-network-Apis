import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class SignInInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  usernameOrEmail: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}
