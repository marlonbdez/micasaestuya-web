import type { HttpRequestOptions } from '../../types'
import { useAuthStore } from '~/stores/auth'

class FetchFactory {
  private httpClient
  store

  constructor(httpClient: any) {
    this.httpClient = httpClient
    this.store = useAuthStore()
  }

  get token() {
    return this.store.token
  }

  get authHeaders() {
    if (!this.token) {
      return {}
    }

    return {
      Authorization: `Bearer ${this.token}`
    }
  }

  async call<T>(
    method: string,
    url: string,
    body = {},
    extras = {}
  ): Promise<T> {
    const options = <HttpRequestOptions>{
      method,
      ...extras
    }

    if (Object.keys(body).length) {
      options.body = body
    }

    const response: T = await this.httpClient(url, options)

    return response
  }
}

export default FetchFactory
