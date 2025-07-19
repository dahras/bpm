# Microsoft Entra ID Authentication

This plugin enables authentication using Microsoft Entra ID (Azure Active Directory) and provides an action to synchronise users from Microsoft Graph.

## Features

- Sign in with the OAuth 2.0 authorization code from Microsoft Entra ID.
- Automatically create or update users in NocoBase using Microsoft Graph profile data.
- Synchronise all users from Microsoft Graph to the local database via the `azureUsers:sync` action.

## Usage

Configure an authenticator of type `azure-ad` with the following options:

```
{
  "tenantId": "<tenant-id>",
  "clientId": "<application-client-id>",
  "clientSecret": "<client-secret>",
  "redirectUri": "<redirect-uri>"
}
```

Then call the authentication API with the authorization `code` returned by Microsoft Entra ID.

The `azureUsers:sync` resource action can be used to fetch users from Microsoft Graph and store them in the local `users` collection.
