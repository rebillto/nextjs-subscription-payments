export async function POST(req: Request) {
  try {
    // Step 1: Get an Auth0 token
    const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL; 
    const clientId = process.env.AUTH0_CLIENT_ID; 
    const clientSecret = process.env.AUTH0_CLIENT_SECRET; 
    const audience = process.env.AUTH0_API_URL;

    const tokenEndpoint = `${auth0Domain}/oauth/token`;

    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: audience,
        grant_type: 'client_credentials',
      }),
    })
    .then(data => data)

    if (tokenResponse?.status != 200) {
      throw new Error('Error fetching Auth0 token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const body = await req.json();
    
    // Step 2: Update user metadata
    const userId = body?.auth0_user_id; 
    const metadataToUpdate = body?.metadataToUpdate;

    const userMetadataEndpoint = `${audience}users/${userId}`;
    const updateMetadataResponse = await fetch(userMetadataEndpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        user_metadata: metadataToUpdate,
      }),
    });

    if (!updateMetadataResponse.ok) {
      throw new Error('Error updating user metadata');
    }
    return new Response(JSON.stringify({ message: 'Metadata updated successfully' }), {
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
