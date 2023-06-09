import { ApolloDriverConfig, ApolloFederationDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

import * as winston from 'winston';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';

import { CommonModule } from './common/common.module';
import { join } from 'path';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { PrismaService } from './common/prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/accessToken.guard';
import { PostModule } from './domain/post/post.module';
import { UserModule } from './domain/user/user.module';

@Module({
  imports: [
    CommonModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
            nestWinstonModuleUtilities.format.nestLike('Winston'),
          ),
        }),
      ],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
      useGlobalPrefix: true,
      context: ({ req, res }: Record<string, any>) => {
        return { req, res, logger: req.logger, loaders: req['loaders'] };
      },
      cors: {
        credentials: true,
        origin: true,
      },
      // add formatError
      buildSchemaOptions: {
        orphanedTypes: [],
      },
    }),
    AuthModule,
    PostModule,
    UserModule,
  ],
  providers: [PrismaService, { provide: APP_GUARD, useClass: AccessTokenGuard }],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply().forRoutes('private');
  }
}
