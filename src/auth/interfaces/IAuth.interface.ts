import { HttpException } from '@nestjs/common';
import { IUser } from '../../domain/user/types/user.type';
import { SignInInput } from '../dto/input/signin.input';
import { SignUpInput } from '../dto/input/signup.input';
import { AuthResponseOutput } from '../dto/output/auth.response.output';
import { LogoutResponseOutput } from '../dto/output/logout.response.output';
import { ICreateTokens } from '../types/auth.type';

export interface IAuthService {
  signUp(input: SignUpInput): Promise<[AuthResponseOutput, HttpException]>;
  signIn(input: SignInInput): Promise<[AuthResponseOutput, HttpException]>;
  createTokens(userId: string, email: string): Promise<ICreateTokens>;
  updateRefreshedToken(userId: string, refreshedToken: string): Promise<void>;
  logout(userId: string): Promise<LogoutResponseOutput>;
  validateUsernameOrEmailExist(usernameOrEmail: string): Promise<IUser>;
  getNewTokens(userId: string, rt: string): Promise<[AuthResponseOutput, HttpException]>;
  checkDuplicateUserNameOrEmail(userName: string, email: string): Promise<void>;
}
