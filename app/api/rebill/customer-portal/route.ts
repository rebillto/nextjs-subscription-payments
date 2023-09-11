export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");
    const REBILL_API_URL = process.env.NEXT_PUBLIC_REBILL_API_URL;
    const REBILL_API_KEY = process.env.REBILL_API_KEY;

    const customerPortalEndpoint = `${REBILL_API_URL}/customer-portal/sessions/${userId}`;
    const getCustomerPortalSession = await fetch(customerPortalEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${REBILL_API_KEY}`,
      },
    });

    const userMetadata = await getCustomerPortalSession.json();

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