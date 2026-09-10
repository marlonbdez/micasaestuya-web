export interface IPropertyLocation {
  city: string
  country: string
  region?: string
}

export type PropertyStatus = 'active' | 'inactive' | 'deleted'

export interface IPropertyHost {
  id: string
  firstName: string
  lastName: string
}

export interface IProperty {
  id: string
  title: string
  description: string
  location: IPropertyLocation
  host: string | IPropertyHost
  pricePerNight: number
  maxGuests: number
  amenities: string[]
  images: string[]
  status: PropertyStatus
  createdAt: string
  updatedAt: string
}

export interface IPropertyListResponse {
  items: IProperty[]
  total: number
  page: number
  limit: number
}

export interface IPropertyFilters {
  city?: string
  country?: string
  maxGuests?: number
  page?: number
  limit?: number
}

export interface IPropertyCreateInput {
  title: string
  description: string
  location: IPropertyLocation
  pricePerNight: number
  maxGuests: number
  amenities?: string[]
  images?: string[]
}

export interface IPropertyUpdateInput {
  title?: string
  description?: string
  location?: IPropertyLocation
  pricePerNight?: number
  maxGuests?: number
  amenities?: string[]
  images?: string[]
  status?: PropertyStatus
}
