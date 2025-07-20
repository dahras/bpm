import { SchemaComponent } from '@nocobase/client';
import React from 'react';
import { useAuthTranslation } from './locale';

export const Options = () => {
  const { t } = useAuthTranslation();
  return (
    <SchemaComponent
      scope={{ t }}
      schema={{
        type: 'object',
        properties: {
          azure: {
            type: 'void',
            properties: {
              public: {
                type: 'object',
                properties: {
                  tenantId: {
                    type: 'string',
                    title: '{{t("Tenant ID")}}',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                  },
                  clientId: {
                    type: 'string',
                    title: '{{t("Client ID")}}',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                  },
                  clientSecret: {
                    type: 'string',
                    title: '{{t("Client Secret")}}',
                    'x-decorator': 'FormItem',
                    'x-component': 'Password',
                  },
                  redirectUri: {
                    type: 'string',
                    title: '{{t("Redirect URI")}}',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                  },
                },
              },
            },
          },
        },
      }}
    />
  );
};
