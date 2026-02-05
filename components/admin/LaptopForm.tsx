'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'
import { generateSlug } from '@/lib/utils'
import ImageUploader from '@/components/admin/ImageUploader'

interface LaptopFormProps {
  laptop?: any
  isEdit?: boolean
}

export default function LaptopForm({ laptop, isEdit = false }: LaptopFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<any[]>([])
  const [formData, setFormData] = useState({
    brandId: laptop?.brandId || '',
    name: laptop?.name || '',
    slug: laptop?.slug || '',
    description: laptop?.description || '',
    processor: laptop?.processor || '',
    ram: laptop?.ram || '',
    storage: laptop?.storage || '',
    graphics: laptop?.graphics || '',
    display: laptop?.display || '',
    price: laptop?.price || '',
    stockQuantity: laptop?.stockQuantity || '',
    isAvailable: laptop?.isAvailable ?? true,
    mainImage: laptop?.mainImage || '',
    image2: laptop?.image2 || '',
    image3: laptop?.image3 || '',
    image4: laptop?.image4 || '',
    image5: laptop?.image5 || '',
    fakeRating: laptop?.fakeRating || '4.5',
    fakeReviewCount: laptop?.fakeReviewCount || '0',
  })

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

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Auto-generate slug from name
    if (field === 'name' && !isEdit) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }))
    }
  }

  const handleImageUpload = (field: string, url: string) => {
    setFormData(prev => ({ ...prev, [field]: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEdit ? `/api/laptops/${laptop.id}` : '/api/laptops'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(isEdit ? 'Laptop updated successfully' : 'Laptop created successfully')
        router.push('/admin/laptops')
        router.refresh()
      } else {
        toast.error('Failed to save laptop')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this laptop?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/laptops/${laptop.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Laptop deleted successfully')
        router.push('/admin/laptops')
        router.refresh()
      } else {
        toast.error('Failed to delete laptop')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="brandId">Brand *</Label>
            <Select
              value={formData.brandId}
              onValueChange={value => handleChange('brandId', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map(brand => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Laptop Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="e.g., Dell XPS 15 9520"
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={e => handleChange('slug', e.target.value)}
              placeholder="dell-xps-15-9520"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Detailed description of the laptop..."
              rows={4}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="processor">Processor *</Label>
              <Input
                id="processor"
                value={formData.processor}
                onChange={e => handleChange('processor', e.target.value)}
                placeholder="Intel Core i7 12th Gen"
                required
              />
            </div>

            <div>
              <Label htmlFor="ram">RAM *</Label>
              <Input
                id="ram"
                value={formData.ram}
                onChange={e => handleChange('ram', e.target.value)}
                placeholder="16GB DDR4"
                required
              />
            </div>

            <div>
              <Label htmlFor="storage">Storage *</Label>
              <Input
                id="storage"
                value={formData.storage}
                onChange={e => handleChange('storage', e.target.value)}
                placeholder="512GB SSD"
                required
              />
            </div>

            <div>
              <Label htmlFor="graphics">Graphics *</Label>
              <Input
                id="graphics"
                value={formData.graphics}
                onChange={e => handleChange('graphics', e.target.value)}
                placeholder="NVIDIA RTX 3050"
                required
              />
            </div>

            <div>
              <Label htmlFor="display">Display *</Label>
              <Input
                id="display"
                value={formData.display}
                onChange={e => handleChange('display', e.target.value)}
                placeholder="15.6 inch FHD"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & Stock</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (PKR) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={e => handleChange('price', e.target.value)}
                placeholder="150000"
                required
              />
            </div>

            <div>
              <Label htmlFor="stockQuantity">Stock Quantity *</Label>
              <Input
                id="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={e => handleChange('stockQuantity', e.target.value)}
                placeholder="10"
                required
              />
            </div>

            <div>
              <Label htmlFor="fakeRating">Rating (1-5)</Label>
              <Input
                id="fakeRating"
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.fakeRating}
                onChange={e => handleChange('fakeRating', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fakeReviewCount">Review Count</Label>
              <Input
                id="fakeReviewCount"
                type="number"
                value={formData.fakeReviewCount}
                onChange={e => handleChange('fakeReviewCount', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={e => handleChange('isAvailable', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="isAvailable">Available for sale</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Main Image * (Required)</Label>
            <ImageUploader
              currentImage={formData.mainImage}
              onUpload={url => handleImageUpload('mainImage', url)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Image 2 (Optional)</Label>
              <ImageUploader
                currentImage={formData.image2}
                onUpload={url => handleImageUpload('image2', url)}
              />
            </div>

            <div>
              <Label>Image 3 (Optional)</Label>
              <ImageUploader
                currentImage={formData.image3}
                onUpload={url => handleImageUpload('image3', url)}
              />
            </div>

            <div>
              <Label>Image 4 (Optional)</Label>
              <ImageUploader
                currentImage={formData.image4}
                onUpload={url => handleImageUpload('image4', url)}
              />
            </div>

            <div>
              <Label>Image 5 (Optional)</Label>
              <ImageUploader
                currentImage={formData.image5}
                onUpload={url => handleImageUpload('image5', url)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Laptop' : 'Create Laptop'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        {isEdit && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
