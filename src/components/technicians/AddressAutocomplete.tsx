'use client'

import { useEffect, useRef, useState } from 'react'
import { getPlaceDetails, type ParsedAddress, searchPlaces } from '@/lib/utils'

interface AddressAutocompleteProps {
  onSelect: (address: ParsedAddress) => void
  selectedAddress: ParsedAddress | null
  error?: string
}

export default function AddressAutocomplete({ onSelect, selectedAddress, error }: AddressAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [predictions, setPredictions] = useState<Array<{ place_id: string; description: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (selectedAddress) {
      setQuery(selectedAddress.formattedAddress)
    }
  }, [selectedAddress])

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setPredictions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      const results = await searchPlaces(searchQuery)
      setPredictions(results)
      setShowSuggestions(true)
    } catch (err) {
      console.error('Error searching places:', err)
      setPredictions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      handleSearch(value)
    }, 300)
  }

  const handleSelectPlace = async (placeId: string, description: string) => {
    setIsLoading(true)
    try {
      const addressDetails = await getPlaceDetails(placeId)
      onSelect(addressDetails)
      setQuery(description)
      setShowSuggestions(false)
    } catch (err) {
      console.error('Error fetching place details:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div ref={wrapperRef} className='relative'>
      <input
        id='addressSearch'
        type='text'
        value={query}
        onChange={handleInputChange}
        onFocus={() => {
          if (predictions.length > 0) {
            setShowSuggestions(true)
          }
        }}
        className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-steel-blue focus:border-transparent`}
        placeholder='Search address...'
        disabled={isLoading}
      />
      {isLoading && (
        <div className='absolute right-3 top-13 flex items-center gap-2'>
          <div className='w-2 h-2 bg-slate-400 rounded-full animate-pulse' />
          <div className='w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75' />
          <div className='w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150' />
        </div>
      )}
      {showSuggestions && predictions.length > 0 && (
        <ul className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto'>
          {predictions.map(prediction => (
            <li
              key={prediction.place_id}
              onClick={() => handleSelectPlace(prediction.place_id, prediction.description)}
              className='px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0'
            >
              <div className='font-medium text-gray-900'>{prediction.description}</div>
            </li>
          ))}
        </ul>
      )}
      {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
    </div>
  )
}
