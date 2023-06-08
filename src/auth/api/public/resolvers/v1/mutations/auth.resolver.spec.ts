import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../../../services/auth.service';
import { AuthMutationResolver } from './auth.resolver';

describe('AuthResolver', () => {
  let resolver: AuthMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthMutationResolver, AuthService],
    }).compile();

    resolver = module.get<AuthMutationResolver>(AuthMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
