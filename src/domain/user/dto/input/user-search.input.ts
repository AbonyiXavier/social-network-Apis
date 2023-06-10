import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UserSearchByInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  searchTerm?: string;
}
