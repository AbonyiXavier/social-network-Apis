import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class PostSearchByInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  searchTerm?: string;
}
