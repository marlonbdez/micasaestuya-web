import type { IProperty } from './property'

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface IBookingUser {
  id: string
  firstName: string
  lastName: string
}

export interface IBooking {
  id: string
  property:
    | string
    | Pick<IProperty, 'id' | 'title' | 'location' | 'images' | 'pricePerNight'>
  guest: string | IBookingUser
  host: string | IBookingUser
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: BookingStatus
  createdAt: string
  updatedAt: string
}

export interface IBookingListResponse {
  items: IBooking[]
  total: number
  page: number
  limit: number
}

export interface IBookingCreateInput {
  propertyId: string
  checkIn: string
  checkOut: string
  guests: number
}

export interface IBookingStatusUpdate {
  status: BookingStatus
}
