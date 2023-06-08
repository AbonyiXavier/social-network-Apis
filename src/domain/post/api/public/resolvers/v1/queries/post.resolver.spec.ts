import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../../../../../services/post.service';
import { PostQueryResolver } from './post.resolver';

describe('PostResolver', () => {
  let resolver: PostQueryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostQueryResolver, PostService],
    }).compile();

    resolver = module.get<PostQueryResolver>(PostQueryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
