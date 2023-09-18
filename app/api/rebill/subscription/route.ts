export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const subscriptionId = url.searchParams.get("subscription_id");
    const REBILL_API_URL = process.env.NEXT_PUBLIC_REBILL_API_URL;
    const REBILL_API_KEY = process.env.REBILL_API_KEY;

    const subscriptionEndpoint = `${REBILL_API_URL}/subscriptions/${subscriptionId}`;
    const getSubscriptionDetail = await fetch(subscriptionEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${REBILL_API_KEY}`,
      },
    });

    const userMetadata = await getSubscriptionDetail.json();

    return new Response(JSON.stringify(userMetadata), {
      status: 200,
    });
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