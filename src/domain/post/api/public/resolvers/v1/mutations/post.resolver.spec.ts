import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../../../../../services/post.service';
import { PostMutationResolver } from './post.resolver';

describe('PostResolver', () => {
  let resolver: PostMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostMutationResolver, PostService],
    }).compile();

    resolver = module.get<PostMutationResolver>(PostMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
