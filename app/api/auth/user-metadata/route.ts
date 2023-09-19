export async function POST(req: Request) {
  try {
    // Step 1: Get an Auth0 token

    const audience = process.env.AUTH0_API_URL;

    const accessToken = await getAuth0Token();

    const body = await req.json();

    // Step 2: Get user metadata
    const userId = body?.auth0_user_id;
    const userMetadataEndpoint = `${audience}users/${userId}`;
    const getUserMetadataResponse = await fetch(userMetadataEndpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!getUserMetadataResponse.ok) {
      throw new Error('Error fetching user metadata');
    }

    const existingUserMetadata = await getUserMetadataResponse.json();

    // Step 3: Update user metadata
    const metadataToUpdate = body?.metadata;

    if (existingUserMetadata.user_metadata && metadataToUpdate) {
      for (const prop in metadataToUpdate) {
        if (
          existingUserMetadata.user_metadata.hasOwnProperty(prop) &&
          prop !== 'rebill_user_id'
        ) {
          if (!Array.isArray(existingUserMetadata.user_metadata[prop])) {
            existingUserMetadata.user_metadata[prop] = [
              existingUserMetadata.user_metadata[prop]
            ];
          }
          existingUserMetadata.user_metadata[prop].push(metadataToUpdate[prop]);
        } else {
          existingUserMetadata.user_metadata[prop] = metadataToUpdate[prop];
        }
      }
    }
    const updateMetadataResponse = await fetch(userMetadataEndpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        user_metadata: existingUserMetadata.user_metadata
      })
    });

    if (!updateMetadataResponse.ok) {
      throw new Error('Error updating user metadata');
    }

    return new Response(
      JSON.stringify({ message: 'Metadata updated successfully' }),
      {
        status: 200
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: { statusCode: 500, message: 'Server error' }
      }),
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Step 1: Get an Auth0 token

    const audience = process.env.AUTH0_API_URL;

    const accessToken = await getAuth0Token();

    // Step 2: Get user metadata
    const url = new URL(req.url);
    const userId = url.searchParams.get('user_id');
    const userMetadataEndpoint = `${audience}users/${userId}`;
    const getUserMetadataResponse = await fetch(userMetadataEndpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!getUserMetadataResponse.ok) {
      throw new Error('Error fetching user metadata');
    }

    const userMetadata = await getUserMetadataResponse.json();

    return new Response(JSON.stringify(userMetadata), {
      status: 200
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: { statusCode: 500, message: 'Server error' }
      }),
      { status: 500 }
    );
  }
}

export async function getAuth0Token() {
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const audience = process.env.AUTH0_API_URL;

  const tokenEndpoint = `${auth0Domain}/oauth/token`;

  const tokenResponse = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      audience: audience,
      grant_type: 'client_credentials'
    })
  }).then((data) => data);

  if (tokenResponse?.status != 200) {
    throw new Error('Error fetching Auth0 token');
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}
