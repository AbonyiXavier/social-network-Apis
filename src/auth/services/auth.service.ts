import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as argon from 'argon2';
import { validateDateOfBirth } from '../utilities/auth.utilities';
import { AuthResponseOutput } from '../dto/output/auth.response.output';
import { SignUpInput } from '../dto/input/signup.input';
import { SignInInput } from '../dto/input/signin.input';
import { IUser } from '../../domain/user/types/user.type';
import { LogoutResponseOutput } from '../dto/output/logout.response.output';
import { ICreateTokens } from '../types/auth.type';
import { IAuthService } from '../interfaces/IAuth.interface';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<[AuthResponseOutput, HttpException]> {
    try {
      const { password, userName, email, fullName, dateOfBirth } = signUpInput;

      await this.checkDuplicateUserNameOrEmail(userName, email);

      validateDateOfBirth(dateOfBirth);

      const hashedPassword = await argon.hash(password);
      const user = await this.prisma.user.create({
        data: {
          userName,
          fullName,
          dateOfBirth,
          email,
          password: hashedPassword,
        },
      });

      const { accessToken, refreshToken } = await this.createTokens(user?.id, user?.email);

      await this.updateRefreshedToken(user?.id, refreshToken);

      const response = { accessToken, refreshToken, user };

      return [response, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  async signIn(signInInput: SignInInput): Promise<[AuthResponseOutput, HttpException]> {
    const { usernameOrEmail, password } = signInInput;

    try {
      const user = await this.validateUsernameOrEmailExist(usernameOrEmail);

      const isPasswordMatch = await argon.verify(user?.password, password);

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid credentials provided');
      }

      const { accessToken, refreshToken } = await this.createTokens(user?.id, user?.email);

      await this.updateRefreshedToken(user?.id, refreshToken);

      const response = { accessToken, refreshToken, user };

      return [response, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  async createTokens(userId: string, email: string): Promise<ICreateTokens> {
    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      { expiresIn: '1h', secret: this.configService.get('ACCESS_TOKEN_SECRET') },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      { expiresIn: '7d', secret: this.configService.get('REFRESHED_TOKEN_SECRET') },
    );

    return { accessToken, refreshToken };
  }

  async updateRefreshedToken(userId: string, refreshedToken: string): Promise<void> {
    const hashedRefreshedToken = await argon.hash(refreshedToken);
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          refreshToken: hashedRefreshedToken,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update refreshedToken');
    }
  }

  async logout(userId: string): Promise<LogoutResponseOutput> {
    try {
      await this.prisma.user.updateMany({
        where: {
          id: userId,
          refreshToken: { not: null },
        },
        data: {
          refreshToken: null,
        },
      });

      return { loggedOut: true };
    } catch (error) {
      throw new InternalServerErrorException('Failed to logout');
    }
  }

  /***
   *  Validator to check if username or email exists
   */
  async validateUsernameOrEmailExist(usernameOrEmail: string): Promise<IUser> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ userName: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      throw new BadRequestException(`User with username or email does not exist.`);
    }

    return user;
  }

  async getNewTokens(userId: string, rt: string): Promise<[AuthResponseOutput, HttpException]> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new ForbiddenException('Access Denied');
      }

      const doRefreshTokenMatch = await argon.verify(user?.refreshToken, rt);

      if (!doRefreshTokenMatch) {
        throw new ForbiddenException('Access Denied');
      }

      const { accessToken, refreshToken } = await this.createTokens(user?.id, user?.email);

      await this.updateRefreshedToken(user?.id, refreshToken);

      const response = { accessToken, refreshToken, user };

      return [response, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  /***
   * Checks duplicate userName or email
   */
  async checkDuplicateUserNameOrEmail(userName: string, email: string): Promise<void> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ userName: userName }, { email: email }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already in use.');
    }
  }
}
