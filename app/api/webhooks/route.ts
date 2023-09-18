import { getAuth0Token } from "../auth/user-metadata/route";

const NEW_STATUS_CANCELLED = "CANCELLED";

// Function to handle cancellation request
async function handleCancellationRequest(req: Request) {
  try {
    const audience = process.env.AUTH0_API_URL;
    const body = await req.json();
    const { billingScheduleId, newStatus } = body;

    if (billingScheduleId && newStatus === NEW_STATUS_CANCELLED) {
      const accessToken = await getAuth0Token();
      const subscriptionDetail = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/rebill/subscription?subscription_id=${billingScheduleId}`, {
        method: 'get'
      }).then(data => data.json());
      const metadataToRemove = (subscriptionDetail?.price?.parent ? subscriptionDetail?.price?.parent : subscriptionDetail?.price?.id);
      const userId = subscriptionDetail?.metadataObject?.auth_id;

      console.log(metadataToRemove, userId);

      if (!userId || !metadataToRemove) {
        return new Response(
          JSON.stringify({ message: 'Invalid request body' }),
          { status: 400 }
        );
      }

      const userMetadataEndpoint = `${audience}users/${userId}`;
      const getUserMetadataResponse = await fetch(userMetadataEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!getUserMetadataResponse.ok) {
        throw new Error('Error fetching user metadata: ' + getUserMetadataResponse.statusText);
      }

      let shouldUpdate = false;
      let userMetadata = await getUserMetadataResponse.json();

      if (
        userMetadata.user_metadata &&
        userMetadata.user_metadata.hasOwnProperty("rebill_item_id")
      ) {
        if (
          Array.isArray(userMetadata.user_metadata.rebill_item_id) &&
          userMetadata.user_metadata.rebill_item_id.includes(metadataToRemove)
        ) {
          userMetadata.user_metadata.rebill_item_id = userMetadata.user_metadata.rebill_item_id.filter(
            (item: string) => item !== metadataToRemove
          );
          shouldUpdate = true;
        } else if (userMetadata.user_metadata.rebill_item_id === metadataToRemove) {
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
          throw new Error('Error updating user metadata: ' + updateMetadataResponse.statusText);
        }

        return new Response(
          JSON.stringify({ message: 'Metadata updated successfully' }),
          {
            status: 200,
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ message: 'Metadata not updated.' }),
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

// Main handler
export async function POST(req: Request) {
  return handleCancellationRequest(req);
}