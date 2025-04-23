import { Environment } from 'src/configurations/validation';

export interface ConfigModuleOptions {
  env: Environment | 'development' | 'production';
}
