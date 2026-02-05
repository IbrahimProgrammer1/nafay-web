import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import PasswordProtection from '@/components/admin/PasswordProtection'
import Link from 'next/link'
import { LayoutDashboard, Laptop, Tag, BarChart3 } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('admin_auth')?.value === 'authenticated'

  if (!isAuthenticated) {
    return <PasswordProtection />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-primary">
                NAFAY Admin
              </Link>
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/admin"
                  className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/admin/laptops"
                  className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <Laptop className="h-4 w-4" />
                  <span>Laptops</span>
                </Link>
                <Link
                  href="/admin/brands"
                  className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <Tag className="h-4 w-4" />
                  <span>Brands</span>
                </Link>
                <Link
                  href="/admin/analytics"
                  className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </Link>
              </div>
            </div>
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              View Site
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
