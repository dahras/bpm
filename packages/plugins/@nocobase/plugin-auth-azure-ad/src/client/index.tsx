import { Plugin } from '@nocobase/client';
import AuthPlugin from '@nocobase/plugin-auth/client';
import { Options } from './Options';
import { authType } from '../server/plugin';

export class PluginAuthAzureADClient extends Plugin {
  async load() {
    const auth = this.app.pm.get(AuthPlugin);
    auth.registerType(authType, {
      components: {
        AdminSettingsForm: Options,
      },
    });
  }
}

export default PluginAuthAzureADClient;
