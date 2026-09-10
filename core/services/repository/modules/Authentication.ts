import HttpFactory from '../HttpFactory'
import type {
  IUserInfo,
  ILoginInput,
  ILoginResponse,
  IAuthenticationModule,
  IRegisterInput,
  IRegisterResponse
} from '~/core/types'

export default class AuthenticationModule
  extends HttpFactory
  implements IAuthenticationModule
{
  private resource = 'users'

  async register(credentials: IRegisterInput): Promise<IRegisterResponse> {
    return await this.call<IRegisterResponse>(
      'POST',
      `${this.resource}/create`,
      credentials
    )
  }

  async login(credentials: ILoginInput): Promise<ILoginResponse> {
    return await this.call<ILoginResponse>(
      'POST',
      `${this.resource}/login`,
      credentials
    )
  }

  async current(): Promise<IUserInfo> {
    return await this.call<IUserInfo>(
      'GET',
      `${this.resource}/current`,
      {},
      { headers: this.authHeaders }
    )
  }
}
