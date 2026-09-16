import type { IRegionModule, IRegion } from './types/region'

export type {
  IProperty,
  IPropertyLocation,
  IPropertyHost,
  IPropertyListResponse,
  IPropertyFilters,
  IPropertyCreateInput,
  IPropertyUpdateInput,
  PropertyStatus
} from './types/property'
export type {
  IBooking,
  IBookingUser,
  IBookingListResponse,
  IBookingCreateInput,
  IBookingStatusUpdate,
  BookingStatus
} from './types/booking'

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

export type UserRole = 'guest' | 'host' | 'admin'

export interface IUserInfo {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
}

export interface IAuthModule {
  register(credentials: IRegisterInput): Promise<ILoginResponse>
  login(credentials: ILoginInput): Promise<ILoginResponse>
  current(): Promise<IUserInfo>
}

export interface IServicesInstance {
  auth: IAuthModule
  region: IRegionModule
}

export type HttpRequestOptions = {
  method: string
  url: string
  body?: object
  extras?: object
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

export interface ISearchParams {
  destination: string
  checkIn: string | null
  checkOut: string | null
  guests: number
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

export interface IAdAddress {
  region: IAdRegion | null
  street: string
  streetNumber: string
}

export interface IAdDetails {
  price: number | null
  surface: number | null
  bedrooms: number | null
  bathrooms: number | null
}

export interface IAdDraft {
  type: PropertyType | null
  operation: OperationType | null
  address: IAdAddress
  details: IAdDetails
  // Solo ids: los ficheros viven en IndexedDB, no en el borrador.
  photos: string[]
  description: string
}
