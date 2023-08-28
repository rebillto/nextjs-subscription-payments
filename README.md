# Next.js Subscription Payments Starter

## Features

- Secure user authentication with [Auth0](https://auth0.com/)
- Integration with Rebill checkout [Rebill Docs](https://docs.rebill.to/docs/js)

## Configure Auth with Auth0

### Get Your Application Keys

When you signed up for Auth0, a new application was created for you, or you could have created a new one. You will need some details about that application to communicate with Auth0. You can get these details from the [Application Settings](https://manage.auth0.com/#/applications) section in the Auth0 dashboard.
You need the following information:

- Domain
- Client ID
- Client Secret

### Configure Callback URLs

A callback URL is a URL in your application where Auth0 redirects the user after they have authenticated. The callback URL for your app must be added to the Allowed Callback URLs field in your Application Settings. If this field is not set, users will be unable to log in to the application and will get an error.

### Configure Logout URLs

A logout URL is a URL in your application that Auth0 can return to after the user has been logged out of the authorization server. This is specified in the returnTo query parameter. The logout URL for your app must be added to the Allowed Logout URLs field in your Application Settings. If this field is not set, users will be unable to log out from the application and will get an error.

In the root directory of your project, add the file `.env.local` with the following environment variables:

```env
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://{yourDomain}'
AUTH0_CLIENT_ID='{yourClientId}'
AUTH0_CLIENT_SECRET='{yourClientSecret}'
```

# Configuring Rebill

This guide will walk you through the steps to configure Rebill for your project.

## Getting Started

1. **Login to Your Rebill Dashboard**: [Rebill Dashboard](https://dashboard.rebill.dev/integrations) - Log in to your Rebill dashboard and generate an API key.

2. **Get Your Organization ID**: [Settings Panel](https://dashboard.rebill.dev/settings) - Retrieve your organization ID from the settings panel in your Rebill dashboard.

3. **Update `.env.local` File**: Update your `.env.local` file with the following environment variables:

   ```env
   NEXT_PUBLIC_REBILL_ORG_ID='{yourOrgId}'
   NEXT_PUBLIC_REBILL_API_KEY='{yourApiKey}'
   NEXT_PUBLIC_REBILL_API_URL='https://api.rebill.dev/v2'
   ```

## Creating Product and Pricing Information
