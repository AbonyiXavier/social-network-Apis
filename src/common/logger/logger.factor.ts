import * as winston from 'winston';

import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';

const TypeOrmErrorFilter = winston.format((info) => {
  if (info.stack && info.stack.toString().includes('TypeORMError')) {
    info.message = '[SLACK] ' + info.message;
  }

  return info;
});

const devLogger = () => {
  return WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(TypeOrmErrorFilter(), winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike()),
      }),
    ],
  });
};

const prodLogger = () => {
  return WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(TypeOrmErrorFilter(), winston.format.timestamp(), winston.format.json()),
      }),
    ],
  });
};

export class LoggerFactory {
  static getInstance(environment: string) {
    switch (environment) {
      case 'development': {
        return devLogger();
      }
      default: {
        return prodLogger();
      }
    }
  }
}
