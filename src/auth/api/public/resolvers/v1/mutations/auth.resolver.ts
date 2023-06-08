import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from '../../../../../services/auth.service';
import { Auth } from '../../../../../entities/auth.entity';
import { SignUpInput } from '../../../../../dto/input/signup.input';
import { AuthResponseOutput } from '../../../../../dto/output/auth.response.output';
import { SignInInput } from '../../../../../dto/input/signin.input';
import { LogoutResponseOutput } from '../../../../../dto/output/logout.response.output';
import { Public } from '../../../../../../common/decorators/public.decorator';
import { NewTokenResponseOutput } from '../../../../../dto/output/newToken.response.output';
import { CurrentUserId } from '../../../../../../common/decorators/currentUserId.decorator';
import { CurrentUser } from '../../../../../../common/decorators/currentUser.decorator';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '../../../../../guards/refreshToken.guard';

@Resolver(() => Auth)
export class AuthMutationResolver {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Mutation(() => AuthResponseOutput, {
    name: 'signUp',
    description: 'SignUp a user',
  })
  async signUp(@Args('input') signUpInput: SignUpInput) {
    const [response, error] = await this.authService.signUp(signUpInput);

    if (error) {
      throw error;
    }

    return response;
  }
  @Public()
  @Mutation(() => AuthResponseOutput, {
    name: 'signIn',
    description: 'Sign in a user',
  })
  async signIn(@Args('input') signInInput: SignInInput) {
    const [response, error] = await this.authService.signIn(signInInput);

    if (error) {
      throw error;
    }

    return response;
  }

  @Mutation(() => LogoutResponseOutput, {
    name: 'logOut',
    description: 'Log out a user',
  })
  async logout(@Args('id') id: string) {
    return await this.authService.logout(id);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => NewTokenResponseOutput, {
    name: 'getNewTokens',
    description: 'Get new token for a user when accessToken expires',
  })
  async getNewTokens(@CurrentUserId() userId: string, @CurrentUser('refreshToken') refreshToken: string) {
    const [response, error] = await this.authService.getNewTokens(userId, refreshToken);

    if (error) {
      throw error;
    }

    return response;
  }
}
