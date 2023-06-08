import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, body } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      if (body.operationName !== 'IntrospectionQuery')
        this.logger.log(`${method} ${originalUrl} ${statusCode} - ${JSON.stringify(body)} ${contentLength} - ${userAgent} ${ip}`);
    });

    next();
  }
}
