import { InputType, Field } from '@nestjs/graphql';
import { IsAlphanumeric, IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsAlphanumeric()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsDate()
  @IsNotEmpty()
  dateOfBirth: Date;
}
