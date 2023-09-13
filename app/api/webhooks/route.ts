import { getAuth0Token } from "../auth/user-metadata/route";

export async function POST(req: Request) {
  try {
    // Step 1: Get an Auth0 token
    const audience = process.env.AUTH0_API_URL;
    const accessToken = await getAuth0Token();
    const body = await req.json();

    // Step 2: Validate and extract necessary data from the request body
    const userId = body?.auth0_user_id;
    const metadataToRemove = body?.rebill_item_id;
    
    if (!userId || !metadataToRemove) {
      return new Response(
        JSON.stringify({ message: 'Invalid request body' }),
        { status: 400 }
      );
    }

    // Step 3: Get user metadata
    const userMetadataEndpoint = `${audience}users/${userId}`;
    const getUserMetadataResponse = await fetch(userMetadataEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!getUserMetadataResponse.ok) {
      throw new Error('Error fetching user metadata');
    }

    let shouldUpdate = false;
    let userMetadata = await getUserMetadataResponse.json();

    // Step 4: Remove the rebill_item_id from user metadata
    if (
      userMetadata.user_metadata &&
      userMetadata.user_metadata.hasOwnProperty("rebill_item_id")
    ) {
      if (
        Array.isArray(userMetadata.user_metadata.rebill_item_id) &&
        userMetadata.user_metadata.rebill_item_id.includes(metadataToRemove)
      ) {
        userMetadata.user_metadata.rebill_item_id = userMetadata.user_metadata.rebill_item_id.filter(
          (item: string) => item != metadataToRemove
        );
        shouldUpdate = true;
      } else if (userMetadata.user_metadata.rebill_item_id == metadataToRemove) {
        userMetadata.user_metadata.rebill_item_id = [];
        shouldUpdate = true;
      } else {
        return new Response(
          JSON.stringify({
            message: 'Metadata not updated, rebill_item_id not found in user_metadata',
          }),
          {
            status: 404,
          }
        );
      }
    }

    if (shouldUpdate) {
      const updateMetadataResponse = await fetch(userMetadataEndpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user_metadata: userMetadata.user_metadata,
        }),
      });

      if (!updateMetadataResponse.ok) {
        throw new Error('Error updating user metadata');
      }

      return new Response(
        JSON.stringify({ message: 'Metadata updated successfully' }),
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: { statusCode: 500, message: 'Server error' },
      }),
      { status: 500 }
    );
  }
}
