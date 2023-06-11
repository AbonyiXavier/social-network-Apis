import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigHelper {
  private readonly configService: ConfigService<Record<string, unknown>, false>;

  constructor() {
    this.configService = new ConfigService();
  }

  public getNumberWithDefault(key: string, defaultVal: number): number {
    return parseInt(this.getValWithDefault(key, defaultVal));
  }

  public getBoolOrError(key: string): boolean {
    return JSON.parse(this.getValOrError(key));
  }

  public getBoolWithDefault(key: string, defaultVal: boolean): boolean {
    return this.getValWithDefault(key, defaultVal);
  }

  private getValOrError(key: string): any {
    const val = this.configService.get(key);
    if (!val) {
      throw new Error(`[config error] ${key} key is missing`);
    }
    return val;
  }

  private getValWithDefault(key: string, defaultVal: any): any {
    return this.configService.get(key, defaultVal);
  }
}
