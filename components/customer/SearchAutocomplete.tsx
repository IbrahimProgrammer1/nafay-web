'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

interface Suggestion {
  id: string
  name: string
  slug: string
  mainImage: string
  price: number
  brandName: string
}

interface SearchAutocompleteProps {
  placeholder?: string
  className?: string
  inputClassName?: string
  onSearch?: (query: string) => void
}

export default function SearchAutocomplete({
  placeholder = 'Search for laptops...',
  className = '',
  inputClassName = '',
  onSearch,
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Fetch suggestions with debouncing
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/laptops/suggestions?q=${encodeURIComponent(searchQuery)}`
      )
      const data = await response.json()
      setSuggestions(data.suggestions || [])
      setIsOpen(data.suggestions?.length > 0)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer for debounced fetch
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value)
    }, 300)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      performSearch(query.trim())
    }
  }

  // Perform search and close dropdown
  const performSearch = (searchQuery: string) => {
    setIsOpen(false)
    setSuggestions([])
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.name)
    setIsOpen(false)
    router.push(`/laptops/${suggestion.slug}`)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else {
          handleSubmit(e)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Clear search
  const handleClear = () => {
    setQuery('')
    setSuggestions([])
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span key={index} className="font-semibold text-accent-orange">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    )
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setIsOpen(true)
              }
            }}
            className={inputClassName}
            aria-label="Search laptops"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={isOpen}
            autoComplete="off"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-text-secondary" />
            )}
            {query && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Submit search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-black/[0.06] overflow-hidden z-50 max-h-[480px] overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              role="option"
              aria-selected={selectedIndex === index}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${
                selectedIndex === index
                  ? 'bg-[#F6F6F7]'
                  : 'hover:bg-[#F6F6F7]'
              } ${index !== suggestions.length - 1 ? 'border-b border-black/[0.04]' : ''}`}
            >
              {/* Laptop Image */}
              <div className="relative w-16 h-16 flex-shrink-0 bg-[#F2F2F3] rounded-lg overflow-hidden">
                <Image
                  src={suggestion.mainImage || '/placeholder-laptop.png'}
                  alt={suggestion.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              {/* Laptop Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {highlightMatch(suggestion.name, query)}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {highlightMatch(suggestion.brandName, query)}
                </p>
              </div>

              {/* Price */}
              <div className="text-sm font-semibold text-text-primary flex-shrink-0">
                {formatPrice(suggestion.price)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
