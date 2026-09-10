import { $fetch, type FetchOptions } from 'ohmyfetch'

export function createHttpClient(apiUrl) {
  const fetchOptions: FetchOptions = {
    baseURL: apiUrl
  }

  return $fetch.create(fetchOptions)
}
