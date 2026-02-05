'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { X } from 'lucide-react'

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [brands, setBrands] = useState<any[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedRam, setSelectedRam] = useState<string[]>([])
  const [selectedStorage, setSelectedStorage] = useState<string[]>([])
  const [selectedProcessor, setSelectedProcessor] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  const ramOptions = ['4GB', '8GB', '16GB', '32GB']
  const storageOptions = ['256GB SSD', '512GB SSD', '1TB SSD', '1TB HDD']
  const processorOptions = ['i3', 'i5', 'i7', 'i9', 'Ryzen']

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands')
      const data = await response.json()
      setBrands(data.brands)
    } catch (error) {
      console.error('Error fetching brands:', error)
    }
  }

  const handleBrandToggle = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    )
  }

  const handleRamToggle = (ram: string) => {
    setSelectedRam(prev =>
      prev.includes(ram) ? prev.filter(r => r !== ram) : [...prev, ram]
    )
  }

  const handleStorageToggle = (storage: string) => {
    setSelectedStorage(prev =>
      prev.includes(storage) ? prev.filter(s => s !== storage) : [...prev, storage]
    )
  }

  const handleProcessorToggle = (processor: string) => {
    setSelectedProcessor(prev =>
      prev.includes(processor)
        ? prev.filter(p => p !== processor)
        : [...prev, processor]
    )
  }

  const applyFilters = () => {
    onFilterChange({
      brandIds: selectedBrands,
      ram: selectedRam,
      storage: selectedStorage,
      processor: selectedProcessor,
      minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
      maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
    })
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setSelectedRam([])
    setSelectedStorage([])
    setSelectedProcessor([])
    setPriceRange({ min: '', max: '' })
    onFilterChange({})
  }

  const hasActiveFilters = selectedBrands.length > 0 || selectedRam.length > 0 ||
    selectedStorage.length > 0 || selectedProcessor.length > 0

  return (
    <Card className="border-0 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs text-text-secondary hover:text-accent-orange"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Brands */}
        <div>
          <Label className="text-sm font-semibold mb-3 block text-text-primary">Brand</Label>
          <div className="space-y-2">
            {brands.map(brand => (
              <div
                key={brand.id}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-colors cursor-pointer ${
                  selectedBrands.includes(brand.id)
                    ? 'bg-text-primary text-white'
                    : 'bg-[#F6F6F7] hover:bg-[#ECECED]'
                }`}
                onClick={() => handleBrandToggle(brand.id)}
              >
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={() => handleBrandToggle(brand.id)}
                  className={selectedBrands.includes(brand.id) ? 'border-white' : ''}
                />
                <label
                  htmlFor={`brand-${brand.id}`}
                  className={`text-sm cursor-pointer flex-1 ${
                    selectedBrands.includes(brand.id) ? 'text-white' : 'text-text-primary'
                  }`}
                >
                  {brand.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* RAM */}
        <div>
          <Label className="text-sm font-semibold mb-3 block text-text-primary">RAM</Label>
          <div className="space-y-2">
            {ramOptions.map(ram => (
              <div
                key={ram}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-colors cursor-pointer ${
                  selectedRam.includes(ram)
                    ? 'bg-text-primary text-white'
                    : 'bg-[#F6F6F7] hover:bg-[#ECECED]'
                }`}
                onClick={() => handleRamToggle(ram)}
              >
                <Checkbox
                  id={`ram-${ram}`}
                  checked={selectedRam.includes(ram)}
                  onCheckedChange={() => handleRamToggle(ram)}
                  className={selectedRam.includes(ram) ? 'border-white' : ''}
                />
                <label
                  htmlFor={`ram-${ram}`}
                  className={`text-sm cursor-pointer flex-1 ${
                    selectedRam.includes(ram) ? 'text-white' : 'text-text-primary'
                  }`}
                >
                  {ram}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Storage */}
        <div>
          <Label className="text-sm font-semibold mb-3 block text-text-primary">Storage</Label>
          <div className="space-y-2">
            {storageOptions.map(storage => (
              <div
                key={storage}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-colors cursor-pointer ${
                  selectedStorage.includes(storage)
                    ? 'bg-text-primary text-white'
                    : 'bg-[#F6F6F7] hover:bg-[#ECECED]'
                }`}
                onClick={() => handleStorageToggle(storage)}
              >
                <Checkbox
                  id={`storage-${storage}`}
                  checked={selectedStorage.includes(storage)}
                  onCheckedChange={() => handleStorageToggle(storage)}
                  className={selectedStorage.includes(storage) ? 'border-white' : ''}
                />
                <label
                  htmlFor={`storage-${storage}`}
                  className={`text-sm cursor-pointer flex-1 ${
                    selectedStorage.includes(storage) ? 'text-white' : 'text-text-primary'
                  }`}
                >
                  {storage}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Processor */}
        <div>
          <Label className="text-sm font-semibold mb-3 block text-text-primary">Processor</Label>
          <div className="space-y-2">
            {processorOptions.map(processor => (
              <div
                key={processor}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-colors cursor-pointer ${
                  selectedProcessor.includes(processor)
                    ? 'bg-text-primary text-white'
                    : 'bg-[#F6F6F7] hover:bg-[#ECECED]'
                }`}
                onClick={() => handleProcessorToggle(processor)}
              >
                <Checkbox
                  id={`processor-${processor}`}
                  checked={selectedProcessor.includes(processor)}
                  onCheckedChange={() => handleProcessorToggle(processor)}
                  className={selectedProcessor.includes(processor) ? 'border-white' : ''}
                />
                <label
                  htmlFor={`processor-${processor}`}
                  className={`text-sm cursor-pointer flex-1 ${
                    selectedProcessor.includes(processor) ? 'text-white' : 'text-text-primary'
                  }`}
                >
                  {processor}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Action Button */}
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}
