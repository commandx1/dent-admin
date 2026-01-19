import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Google Maps Places API utility functions

export interface GooglePlacePrediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export interface GooglePlaceDetails {
  place_id: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  address_components: Array<{
    long_name: string
    short_name: string
    types: string[]
  }>
}

export interface ParsedAddress {
  country: string
  state: string
  city: string
  district: string
  postalCode: string
  addressLine: string
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
}

export async function searchPlaces(query: string): Promise<GooglePlacePrediction[]> {
  const apiKey = import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error('Google Maps API key is not configured')
  }

  const response = await fetch(
    `/api/google-maps/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}&types=address`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch places from Google Maps API')
  }

  const data = await response.json()
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Maps API error: ${data.status}`)
  }

  return data.predictions || []
}

export async function getPlaceDetails(placeId: string): Promise<ParsedAddress> {
  const apiKey = import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error('Google Maps API key is not configured')
  }

  const response = await fetch(
    `/api/google-maps/place/details/json?place_id=${encodeURIComponent(placeId)}&key=${apiKey}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch place details from Google Maps API')
  }

  const data = await response.json()
  if (data.status !== 'OK') {
    throw new Error(`Google Maps API error: ${data.status}`)
  }

  const place: GooglePlaceDetails = data.result
  return parseAddressComponents(place)
}

function parseAddressComponents(place: GooglePlaceDetails): ParsedAddress {
  const components = place.address_components
  let country = ''
  let state = ''
  let city = ''
  let district = ''
  let postalCode = ''
  let streetNumber = ''
  let route = ''

  for (const component of components) {
    const types = component.types

    if (types.includes('country')) {
      country = component.long_name
    } else if (types.includes('administrative_area_level_1')) {
      state = component.long_name
    } else if (types.includes('locality') || types.includes('administrative_area_level_2')) {
      city = component.long_name
    } else if (
      types.includes('sublocality') ||
      types.includes('sublocality_level_1') ||
      types.includes('sublocality_level_2') ||
      types.includes('neighborhood')
    ) {
      // Check multiple types for district information
      if (!district) {
        district = component.long_name
      }
    } else if (types.includes('postal_code')) {
      postalCode = component.long_name
    } else if (types.includes('street_number')) {
      streetNumber = component.long_name
    } else if (types.includes('route')) {
      route = component.long_name
    }
  }

  // Combine street number and route
  let addressLine = ''
  if (streetNumber && route) {
    addressLine = `${streetNumber} ${route}`
  } else if (streetNumber) {
    addressLine = streetNumber
  } else if (route) {
    addressLine = route
  }

  // If addressLine is empty, use the first part of formatted_address
  if (!addressLine && place.formatted_address) {
    const parts = place.formatted_address.split(',')
    addressLine = parts[0]?.trim() || ''
  }

  return {
    country: country || '',
    state: state || '',
    city: city || '',
    district: district || '',
    postalCode: postalCode || '',
    addressLine: addressLine || '',
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
    placeId: place.place_id,
    formattedAddress: place.formatted_address
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}