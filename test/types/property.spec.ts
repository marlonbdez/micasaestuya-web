import { describe, it, expect } from 'vitest'
import type {
  IProperty,
  IPropertyLocation,
  IPropertyHost,
  IPropertyListResponse,
  IPropertyFilters,
  IPropertyCreateInput,
  IPropertyUpdateInput,
  PropertyStatus
} from '@/core/types/property'

describe('IProperty type definitions', () => {
  const validLocation: IPropertyLocation = {
    city: 'Havana',
    country: 'Cuba',
    region: 'Western'
  }

  const validHost: IPropertyHost = {
    id: 'host-123',
    firstName: 'John',
    lastName: 'Host'
  }

  const validProperty: IProperty = {
    id: 'prop-123',
    title: 'Beautiful beachfront apartment',
    description: 'A stunning 2-bedroom apartment with ocean views',
    location: validLocation,
    host: 'host-123',
    pricePerNight: 80,
    maxGuests: 4,
    amenities: ['WiFi', 'Kitchen', 'Air conditioning'],
    images: ['http://example.com/image1.jpg'],
    status: 'active',
    createdAt: '2026-03-10T00:00:00.000Z',
    updatedAt: '2026-03-10T00:00:00.000Z'
  }

  describe('IPropertyLocation', () => {
    it('should have required city and country fields', () => {
      expect(validLocation.city).toBe('Havana')
      expect(validLocation.country).toBe('Cuba')
    })

    it('should allow optional region', () => {
      const locationWithoutRegion: IPropertyLocation = {
        city: 'Santiago',
        country: 'Cuba'
      }
      expect(locationWithoutRegion.region).toBeUndefined()
    })
  })

  describe('IProperty', () => {
    it('should have all required fields', () => {
      expect(validProperty.id).toBeDefined()
      expect(validProperty.title).toBeDefined()
      expect(validProperty.description).toBeDefined()
      expect(validProperty.location).toBeDefined()
      expect(validProperty.host).toBeDefined()
      expect(validProperty.pricePerNight).toBeDefined()
      expect(validProperty.maxGuests).toBeDefined()
      expect(validProperty.amenities).toBeDefined()
      expect(validProperty.images).toBeDefined()
      expect(validProperty.status).toBeDefined()
      expect(validProperty.createdAt).toBeDefined()
      expect(validProperty.updatedAt).toBeDefined()
    })

    it('should accept host as string (ID reference)', () => {
      const property: IProperty = { ...validProperty, host: 'host-456' }
      expect(typeof property.host).toBe('string')
    })

    it('should accept host as IPropertyHost (populated)', () => {
      const property: IProperty = { ...validProperty, host: validHost }
      expect(typeof property.host).toBe('object')
      expect((property.host as IPropertyHost).firstName).toBe('John')
    })

    it('should only accept valid status values', () => {
      const statuses: PropertyStatus[] = ['active', 'inactive', 'deleted']
      statuses.forEach((status) => {
        const property: IProperty = { ...validProperty, status }
        expect(property.status).toBe(status)
      })
    })

    it('should have amenities as string array', () => {
      expect(Array.isArray(validProperty.amenities)).toBe(true)
      expect(validProperty.amenities.length).toBeGreaterThan(0)
    })

    it('should have images as string array', () => {
      expect(Array.isArray(validProperty.images)).toBe(true)
    })
  })

  describe('IPropertyListResponse', () => {
    it('should have pagination fields', () => {
      const response: IPropertyListResponse = {
        items: [validProperty],
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

  describe('IPropertyFilters', () => {
    it('should allow all filters to be optional', () => {
      const emptyFilters: IPropertyFilters = {}
      expect(emptyFilters.city).toBeUndefined()
      expect(emptyFilters.country).toBeUndefined()
      expect(emptyFilters.maxGuests).toBeUndefined()
    })

    it('should accept partial filters', () => {
      const filters: IPropertyFilters = { city: 'Havana', maxGuests: 2 }
      expect(filters.city).toBe('Havana')
      expect(filters.maxGuests).toBe(2)
    })
  })

  describe('IPropertyCreateInput', () => {
    it('should have all required fields for creation', () => {
      const input: IPropertyCreateInput = {
        title: 'New property listing',
        description: 'A great place to stay in Havana',
        location: validLocation,
        pricePerNight: 100,
        maxGuests: 6
      }
      expect(input.title).toBeDefined()
      expect(input.description).toBeDefined()
      expect(input.location).toBeDefined()
      expect(input.pricePerNight).toBeDefined()
      expect(input.maxGuests).toBeDefined()
    })

    it('should allow optional amenities and images', () => {
      const input: IPropertyCreateInput = {
        title: 'New property listing',
        description: 'A great place to stay',
        location: validLocation,
        pricePerNight: 100,
        maxGuests: 6,
        amenities: ['Pool'],
        images: ['http://example.com/photo.jpg']
      }
      expect(input.amenities).toHaveLength(1)
      expect(input.images).toHaveLength(1)
    })
  })

  describe('IPropertyUpdateInput', () => {
    it('should allow partial updates', () => {
      const update: IPropertyUpdateInput = { title: 'Updated title' }
      expect(update.title).toBe('Updated title')
      expect(update.description).toBeUndefined()
    })
  })
})
