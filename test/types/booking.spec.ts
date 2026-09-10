import { describe, it, expect } from 'vitest'
import type {
  IBooking,
  IBookingUser,
  IBookingListResponse,
  IBookingCreateInput,
  IBookingStatusUpdate,
  BookingStatus
} from '@/core/types/booking'

describe('IBooking type definitions', () => {
  const validGuest: IBookingUser = {
    id: 'guest-123',
    firstName: 'Jane',
    lastName: 'Guest'
  }

  const validHost: IBookingUser = {
    id: 'host-456',
    firstName: 'John',
    lastName: 'Host'
  }

  const validBooking: IBooking = {
    id: 'booking-789',
    property: 'prop-123',
    guest: 'guest-123',
    host: 'host-456',
    checkIn: '2026-04-01T00:00:00.000Z',
    checkOut: '2026-04-08T00:00:00.000Z',
    guests: 2,
    totalPrice: 560,
    status: 'pending',
    createdAt: '2026-03-20T00:00:00.000Z',
    updatedAt: '2026-03-20T00:00:00.000Z'
  }

  describe('IBookingUser', () => {
    it('should have id, firstName, and lastName', () => {
      expect(validGuest.id).toBe('guest-123')
      expect(validGuest.firstName).toBe('Jane')
      expect(validGuest.lastName).toBe('Guest')
    })
  })

  describe('IBooking', () => {
    it('should have all required fields', () => {
      expect(validBooking.id).toBeDefined()
      expect(validBooking.property).toBeDefined()
      expect(validBooking.guest).toBeDefined()
      expect(validBooking.host).toBeDefined()
      expect(validBooking.checkIn).toBeDefined()
      expect(validBooking.checkOut).toBeDefined()
      expect(validBooking.guests).toBeDefined()
      expect(validBooking.totalPrice).toBeDefined()
      expect(validBooking.status).toBeDefined()
      expect(validBooking.createdAt).toBeDefined()
      expect(validBooking.updatedAt).toBeDefined()
    })

    it('should accept guest as string (ID reference)', () => {
      const booking: IBooking = { ...validBooking, guest: 'guest-999' }
      expect(typeof booking.guest).toBe('string')
    })

    it('should accept guest as IBookingUser (populated)', () => {
      const booking: IBooking = { ...validBooking, guest: validGuest }
      expect(typeof booking.guest).toBe('object')
      expect((booking.guest as IBookingUser).firstName).toBe('Jane')
    })

    it('should accept host as string or IBookingUser', () => {
      const bookingWithStringHost: IBooking = {
        ...validBooking,
        host: 'host-999'
      }
      expect(typeof bookingWithStringHost.host).toBe('string')

      const bookingWithObjectHost: IBooking = {
        ...validBooking,
        host: validHost
      }
      expect((bookingWithObjectHost.host as IBookingUser).firstName).toBe(
        'John'
      )
    })

    it('should only accept valid booking status values', () => {
      const statuses: BookingStatus[] = [
        'pending',
        'confirmed',
        'cancelled',
        'completed'
      ]
      statuses.forEach((status) => {
        const booking: IBooking = { ...validBooking, status }
        expect(booking.status).toBe(status)
      })
    })

    it('should have positive totalPrice', () => {
      expect(validBooking.totalPrice).toBeGreaterThan(0)
    })

    it('should have at least 1 guest', () => {
      expect(validBooking.guests).toBeGreaterThanOrEqual(1)
    })

    it('should have checkOut after checkIn', () => {
      const checkInDate = new Date(validBooking.checkIn)
      const checkOutDate = new Date(validBooking.checkOut)
      expect(checkOutDate.getTime()).toBeGreaterThan(checkInDate.getTime())
    })
  })

  describe('IBookingListResponse', () => {
    it('should have pagination fields', () => {
      const response: IBookingListResponse = {
        items: [validBooking],
        total: 1,
        page: 1,
        limit: 20
      }
      expect(response.items.length).toBe(1)
      expect(response.total).toBe(1)
      expect(response.page).toBe(1)
      expect(response.limit).toBe(20)
    })
  })

  describe('IBookingCreateInput', () => {
    it('should have all required fields for booking creation', () => {
      const input: IBookingCreateInput = {
        propertyId: 'prop-123',
        checkIn: '2026-04-01',
        checkOut: '2026-04-08',
        guests: 2
      }
      expect(input.propertyId).toBeDefined()
      expect(input.checkIn).toBeDefined()
      expect(input.checkOut).toBeDefined()
      expect(input.guests).toBeDefined()
    })
  })

  describe('IBookingStatusUpdate', () => {
    it('should contain a valid status', () => {
      const update: IBookingStatusUpdate = { status: 'confirmed' }
      expect(update.status).toBe('confirmed')
    })

    it('should accept all valid status transitions', () => {
      const transitions: BookingStatus[] = [
        'pending',
        'confirmed',
        'cancelled',
        'completed'
      ]
      transitions.forEach((status) => {
        const update: IBookingStatusUpdate = { status }
        expect(update.status).toBe(status)
      })
    })
  })
})
