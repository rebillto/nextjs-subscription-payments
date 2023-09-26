# Next.js Subscription Payments Starter

## Features

- Secure user authentication with [Auth0](https://auth0.com/)
- Integration with Rebill checkout [Rebill Docs](https://docs.rebill.to/docs/js)

## Configure Auth with Auth0

### Get Your Application Keys

When you signed up for Auth0, a new application was created for you, or you could have created a new one. You will need some details about that application to communicate with Auth0. You can get these details from the [Application Settings](https://manage.auth0.com/#/applications) section in the Auth0 dashboard. You need the following information:

- Domain
- Client ID
- Client Secret

### Configure Callback URLs

A callback URL is a URL in your application where Auth0 redirects the user after they have authenticated. The callback URL for your app must be added to the Allowed Callback URLs field in your Application Settings. If this field is not set, users will be unable to log in to the application and will get an error.

### Authorize Client Credentials

Authorize Client Credentials by going to Applications → API → Management API → Machine to Machine Applications in your tenant dashboard.

### Configure Logout URLs

A logout URL is a URL in your application that Auth0 can return to after the user has been logged out of the authorization server. This is specified in the returnTo query parameter. The logout URL for your app must be added to the Allowed Logout URLs field in your Application Settings. If this field is not set, users will be unable to log out from the application and will get an error.

In the root directory of your project, add the file `.env.local` with the following environment variables:

```env
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32-byte value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://{yourDomain}'
AUTH0_CLIENT_ID='{yourClientId}'
AUTH0_CLIENT_SECRET='{yourClientSecret}'
AUTH0_API_URL='https://{yourDomain}/api/v2/'
```

# Configuring Rebill

This guide will walk you through the steps to configure Rebill for your project.

## Getting Started

1. **Login to Your Rebill Dashboard**: [Rebill Dashboard](https://dashboard.rebill.com/integrations) - Log in to your Rebill dashboard and generate an API key.

2. **Get Your Organization ID**: [Settings Panel](https://dashboard.rebill.com/settings) - Retrieve your organization ID from the settings panel in your Rebill dashboard.

3. **Get Your Organization Alias**: [Settings Panel](https://dashboard.rebill.com/settings) - Retrieve your organization alias from the settings panel in your Rebill dashboard (Customize your checkout page - https://pay.rebill.com/{yourOrgAlias}).

4. **Create Subscription Change Webhook**: [Webhooks Panel](https://dashboard.rebill.com/webhooks) - Create a webhook for Subscription status change event, with the URL:
   https://your-deployment-url.vercel.app/api/webhooks.

5. **Get your Gateway ID**: [Payments Panel](https://dashboard.rebill.com/rebill-payments) - Retrieve your gateway ID from Rebill payments dashboard.

6. **Update `.env.local` File**: Update your `.env.local` file with the following environment variables:

```env
NEXT_PUBLIC_REBILL_ORG_ID='{yourOrgId}'
REBILL_API_KEY='{yourApiKey}'
NEXT_PUBLIC_REBILL_API_URL='https://api.rebill.com/v2'
NEXT_PUBLIC_REBILL_ORGANIZATION_ALIAS='{yourOrgAlias}'
NEXT_PUBLIC_SITE_URL=https://your-deployment-url.vercel.app

```

# Creating Product and Pricing Information

## Rebill API Upload Script

To speed up the setup, we have added a fixtures file to bootstrap test products and pricing data in your Rebill account. The script executes a series of API requests defined in this JSON file.

## Prerequisites

Before using this script, you need to have the following:

1. Node.js installed on your system.
2. An API Key from Rebill to authenticate your requests.

## How to Use:

1. Install Dependencies:
   Before using the script, make sure you have the required dependencies installed. You can do this by running:

   ```
   npm install
   ```

2. Prepare Item Data:
   Modify the JSON file named `itemsToUpload.json`. This file should contain an array of item objects that you want to upload.

   - Replace "gatewayId": "a32a7858-3b3c-438f-8279-12810b4dbc59" with "gatewayId": {yourGatewayId} in all item prices.

3. Editing `uploadItems.js`:
   To customize the behavior of the script further, open the `uploadItems.js` file and locate the variables you wish to modify, such as `priceLinkExpiration` and `currenciesAvailable`. You can change their values to meet your specific requirements.

4. Simply open a terminal and navigate to the directory `/fixtures` containing the script and JSON files. Run the script using the following command:

   ```
   node uploadItems.js [REBILL_API_KEY] [SUCCESS_PAYMENT_URL]
   ```

   - Replace `[REBILL_API_KEY]` with the REBILL API key.
   - Replace `[SUCCESS_PAYMENT_URL]` with the URL of your production site, for example: `{yourSiteUrl}/success?subscription_id=`
