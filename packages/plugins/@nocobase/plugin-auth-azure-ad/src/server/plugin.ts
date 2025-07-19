/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { InstallOptions, Plugin } from '@nocobase/server';
import { tval } from '@nocobase/utils';
import { AzureADAuth } from './azuread-auth';

export const authType = 'azure-ad';
export const namespace = 'auth-azure-ad';

export class PluginAuthAzureADServer extends Plugin {
  async load() {
    this.app.authManager.registerTypes(authType, {
      auth: AzureADAuth,
      title: tval('Microsoft Entra ID', { ns: namespace }),
    });

    this.app.resource({
      name: 'azureUsers',
      actions: {
        async sync(ctx) {
          const auth = await this.app.authManager.get(authType, ctx);
          await auth.syncUsers();
          ctx.body = { success: true };
        },
      },
    });
    this.app.acl.allow('azureUsers', 'sync');
  }

  async install(options?: InstallOptions) {}
}

export default PluginAuthAzureADServer;
