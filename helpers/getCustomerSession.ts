export async function getCustomerSession(userId: string){
  return fetch(`/api/rebill/customer-portal?user_id=${userId}`, {
    method: 'get'
  }).then(data => data.json())
} 