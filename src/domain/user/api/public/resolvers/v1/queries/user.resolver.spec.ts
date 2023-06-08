import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../../../services/user.service';
import { UserQueryResolver } from './user.resolver';

describe('UserResolver', () => {
  let resolver: UserQueryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserQueryResolver, UserService],
    }).compile();

    resolver = module.get<UserQueryResolver>(UserQueryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
