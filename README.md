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

5. **Update `.env.local` File**: Update your `.env.local` file with the following environment variables:

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

3. Simply open a terminal and navigate to the directory `/fixtures` containing the script and JSON files. Run the script using the following command:

   ```
   node uploadItems.js [REBILL_API_KEY] [SUCCESS_PAYMENT_URL]
   ```

   - Replace `[REBILL_API_KEY]` with the REBILL API key.
   - Replace `[SUCCESS_PAYMENT_URL]` with the URL of your production site, for example: `{yourSiteUrl}/success?subscription_id=`

### 1. Middleware Behavior

The middleware included in this project serves two primary purposes:

- **Authentication Validation:** It ensures that routes starting with `/api/` are properly authenticated. Unauthorized access will result in a `401 Unauthorized` response.

- **Localization:** It manages localization based on user preferences. Make sure to configure the supported locales and default locale as needed.

### 2. Error Handling

The middleware code includes error handling to manage unexpected situations. However, it's crucial to keep the following in mind:

- **Exceptions:** If any unexpected errors occur within the middleware, they will be caught and logged as "Internal Server Error." Be sure to monitor your application logs for any issues.

- **Middleware Order:** The order in which middleware is applied can impact behavior. Ensure that the order of middleware execution aligns with your application's requirements.

- **Configuration:** Verify that the configuration settings for both authentication and localization are correctly set in your environment variables and middleware configuration files.

### 3. Testing

Before deploying your application to a production environment, thoroughly test the middleware's behavior and error handling under various scenarios to ensure your application's security and functionality.

By being aware of these considerations and taking necessary precautions, you can successfully leverage the middleware in this project to build a robust Next.js application.
