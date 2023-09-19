export async function getSubscription(subscriptionId: string) {
  return fetch(`/api/rebill/subscription?subscription_id=${subscriptionId}`, {
    method: 'get'
  }).then((data) => data.json());
}
