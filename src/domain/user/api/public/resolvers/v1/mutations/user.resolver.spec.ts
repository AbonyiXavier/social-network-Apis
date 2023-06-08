import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../../../services/user.service';
import { UserMutationResolver } from './user.resolver';

describe('UserResolver', () => {
  let resolver: UserMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMutationResolver, UserService],
    }).compile();

    resolver = module.get<UserMutationResolver>(UserMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
