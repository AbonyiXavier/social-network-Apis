import { ConfigKeys } from '../constants/config.keys';
import { Injectable } from '@nestjs/common';
import { AppEnv } from '../../enums';
import { ConfigHelper } from '../helper/config.helper';

@Injectable()
export class AppConfigService {
  private readonly graphqlPlaygroundEnabled: boolean;
  private readonly appEnv: string;
  private readonly env: string;
  private readonly mainServicePort: number;
  private readonly port: number;

  constructor(private readonly configHelper: ConfigHelper) {
    this.appEnv = this.configHelper.getStringWithDefault(ConfigKeys.APP_ENV, AppEnv.Development);
    this.env = this.configHelper.getStringWithDefault(ConfigKeys.NODE_ENV, 'development');
    this.mainServicePort = this.configHelper.getNumberWithDefault(ConfigKeys.PORT, 3000);
    this.graphqlPlaygroundEnabled = this.configHelper.getBoolWithDefault(ConfigKeys.GRAPHQL_PLAYGROUND_ENABLED, false);

    this.port = configHelper.getNumberOrError(ConfigKeys.PORT);
  }

  public getMainServicePort(): number {
    return this.mainServicePort;
  }

  public getAppEnv(): AppEnv {
    return this.appEnv as AppEnv;
  }

  public isGraphQLPlaygroundEnabled(): boolean {
    return this.graphqlPlaygroundEnabled;
  }

  public getCurrentENV(): string {
    return this.env;
  }

  getPort(): number {
    return this.port;
  }
}
