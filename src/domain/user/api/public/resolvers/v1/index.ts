import { UserMutationResolver } from './mutations/user.resolver';
import { UserQueryResolver } from './queries/user.resolver';

export const PublicUserV1Resolvers = [UserMutationResolver, UserQueryResolver];
