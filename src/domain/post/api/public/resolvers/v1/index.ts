import { PostMutationResolver } from './mutations/post.resolver';
import { PostQueryResolver } from './queries/post.resolver';

export const PublicPostV1Resolvers = [PostMutationResolver, PostQueryResolver];
