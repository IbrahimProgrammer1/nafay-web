'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateSlug } from '@/lib/utils'
import ImageUploader from '@/components/admin/ImageUploader'

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBrand, setEditingBrand] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logoUrl: '',
  })

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/brands')
      const data = await response.json()
      setBrands(data.brands)
    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingBrand ? `/api/brands/${editingBrand.id}` : '/api/brands'
      const method = editingBrand ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingBrand ? 'Brand updated' : 'Brand created')
        setShowForm(false)
        setEditingBrand(null)
        setFormData({ name: '', slug: '', logoUrl: '' })
        fetchBrands()
      } else {
        toast.error('Failed to save brand')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const handleEdit = (brand: any) => {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      slug: brand.slug,
      logoUrl: brand.logoUrl || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will also delete all laptops of this brand.')) {
      return
    }

    try {
      const response = await fetch(`/api/brands/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Brand deleted')
        fetchBrands()
      } else {
        toast.error('Failed to delete brand')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingBrand ? prev.slug : generateSlug(name),
    }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Brands</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Brand
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Brand Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g., Dell"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="dell"
                  required
                />
              </div>

              <div>
                <Label>Brand Logo (Optional)</Label>
                <ImageUploader
                  currentImage={formData.logoUrl}
                  onUpload={url => setFormData(prev => ({ ...prev, logoUrl: url }))}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingBrand ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingBrand(null)
                    setFormData({ name: '', slug: '', logoUrl: '' })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Brands ({brands.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {brands.map(brand => (
              <div
                key={brand.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{brand.name}</h3>
                  <p className="text-sm text-muted-foreground">{brand.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(brand)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(brand.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
