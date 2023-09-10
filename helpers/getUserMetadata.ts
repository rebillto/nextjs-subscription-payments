export async function getUserMetadata (userId: string){
  return fetch(`/api/auth/user-metadata?user_id=${userId}`, {
    method: 'get'
  }).then(data => data.json())
}