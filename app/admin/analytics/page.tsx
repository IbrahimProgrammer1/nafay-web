import { prisma } from '@/lib/prisma'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function AdminAnalyticsPage() {
  const [mostSearched, mostWishlisted, recentSearches] = await Promise.all([
    prisma.laptop.findMany({
      where: { searchCount: { gt: 0 } },
      orderBy: { searchCount: 'desc' },
      take: 10,
      include: { brand: true },
    }),
    prisma.laptop.findMany({
      where: { wishlistCount: { gt: 0 } },
      orderBy: { wishlistCount: 'desc' },
      take: 10,
      include: { brand: true },
    }),
    prisma.searchLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Most Searched */}
        <Card>
          <CardHeader>
            <CardTitle>Most Searched Laptops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostSearched.length === 0 ? (
                <p className="text-sm text-muted-foreground">No search data yet</p>
              ) : (
                mostSearched.map((laptop, index) => (
                  <div
                    key={laptop.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{laptop.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {laptop.brand.name}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      {laptop.searchCount} searches
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Most Wishlisted */}
        <Card>
          <CardHeader>
            <CardTitle>Most Wishlisted Laptops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostWishlisted.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No wishlist data yet
                </p>
              ) : (
                mostWishlisted.map((laptop, index) => (
                  <div
                    key={laptop.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{laptop.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {laptop.brand.name}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      {laptop.wishlistCount} wishlists
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Searches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Search Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentSearches.length === 0 ? (
              <p className="text-sm text-muted-foreground">No searches yet</p>
            ) : (
              recentSearches.map(search => (
                <div
                  key={search.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="text-sm">{search.searchQuery}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {search.resultsCount} results
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(search.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
