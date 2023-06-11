import { ConfigKeys } from '../constants/config.keys';
import { Injectable } from '@nestjs/common';
import { ConfigHelper } from '../helper/config.helper';

@Injectable()
export class AppConfigService {
  private readonly mainServicePort: number;
  private readonly port: number;

  constructor(private readonly configHelper: ConfigHelper) {
    this.mainServicePort = this.configHelper.getNumberWithDefault(ConfigKeys.PORT, 3000);
  }

  public getMainServicePort(): number {
    return this.mainServicePort;
  }

  getPort(): number {
    return this.port;
  }
}
