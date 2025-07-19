/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';
import { AuthConfig, BaseAuth } from '@nocobase/auth';
import { Model } from '@nocobase/database';
import { AuthModel } from '@nocobase/plugin-auth';

export interface AzureADOptions {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class AzureADAuth extends BaseAuth {
  private client: ConfidentialClientApplication;
  private options: AzureADOptions;

  constructor(config: AuthConfig) {
    const { ctx } = config;
    const options = ctx?.action?.params?.values?.options || {};
    super({ ...config, userCollection: ctx.db.getCollection('users') });
    this.options = options as AzureADOptions;
    const authority = `https://login.microsoftonline.com/${this.options.tenantId}`;
    const msalConfig: Configuration = {
      auth: {
        clientId: this.options.clientId,
        authority,
        clientSecret: this.options.clientSecret,
      },
    };
    this.client = new ConfidentialClientApplication(msalConfig);
  }

  async validate() {
    const ctx = this.ctx;
    const { code } = ctx.action.params.values || {};
    if (!code) {
      ctx.throw(400, 'Missing code');
    }
    const token = await this.client.acquireTokenByAuthorizationCode({
      code,
      redirectUri: this.options.redirectUri,
      scopes: ['https://graph.microsoft.com/.default'],
    });
    const res = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    });
    if (!res.ok) {
      ctx.throw(res.status, await res.text());
    }
    const profile = (await res.json()) as { id: string; userPrincipalName: string; displayName: string };
    const authenticator = this.authenticator as AuthModel;
    let user = await authenticator.findUser(profile.id);
    if (!user) {
      user = await authenticator.findOrCreateUser(profile.id, {
        nickname: profile.displayName,
        email: profile.userPrincipalName,
      });
    }
    return user as Model;
  }

  async syncUsers() {
    const token = await this.client.acquireTokenByClientCredential({ scopes: ['https://graph.microsoft.com/.default'] });
    let url = 'https://graph.microsoft.com/v1.0/users';
    const authenticator = this.authenticator as AuthModel;
    while (url) {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token.accessToken}` } });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      for (const u of data.value) {
        await authenticator.findOrCreateUser(u.id, {
          nickname: u.displayName,
          email: u.mail || u.userPrincipalName,
        });
      }
      url = data['@odata.nextLink'];
    }
  }
}
