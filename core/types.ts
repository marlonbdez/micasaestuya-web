import type { IRegionModule, IRegion } from './types/region'
import type { IListingModule } from './types/listing'

export type {
  IBooking,
  IBookingUser,
  IBookingListResponse,
  IBookingCreateInput,
  IBookingStatusUpdate,
  BookingStatus
} from './types/booking'
export { CollaborationTask } from './types/listing'
export type {
  IListingDraft,
  IListingCreateInput,
  IListing,
  IListingCard,
  IListingPage,
  IListingDetail,
  IListingModule,
  IPhotoUploadRequest,
  IPhotoUpload
} from './types/listing'

export interface ICredentials {
  email: string
  password: string
}

export interface ILoginInput {
  email: string
  password: string
  remember?: boolean
}

export interface ILoginResponse {
  token: string
}

export interface IRegisterInput {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface IRegisterResponse {
  token: string
}

export interface UserModel {
  email: string
  password: string
  name: string
}

export interface IUserInfo {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface IAuthModule {
  register(credentials: IRegisterInput): Promise<ILoginResponse>
  login(credentials: ILoginInput): Promise<ILoginResponse>
  current(): Promise<IUserInfo>
}

export interface IServicesInstance {
  auth: IAuthModule
  region: IRegionModule
  listing: IListingModule
}

export type HttpRequestOptions = {
  method: string
  url: string
  body?: object
  extras?: object
}

export enum AuthModalMode {
  SignIn = 'sign-in',
  SignUp = 'sign-up'
}

export enum ThemeType {
  Light = 'LIGHT',
  Dark = 'DARK',
  System = 'SYSTEM'
}

export enum PropertyCategory {
  House = 'HOUSE',
  Apartment = 'APARTMENT',
  Room = 'ROOM',
  Villa = 'VILLA',
  Cabin = 'CABIN'
}

export enum OperationType {
  Rent = 'RENT',
  Sale = 'SALE',
  Share = 'SHARE'
}

export enum PropertyType {
  Apartment = 'APARTMENT',
  House = 'HOUSE',
  Garage = 'GARAGE',
  Office = 'OFFICE',
  Landscape = 'LANDSCAPE'
}

export type IAdRegion = Omit<IRegion, 'highlighted_text'>
