"use client"
import StadiumFilters from './StadiumFilters'
import StadiumCard from './StadiumCard'
import { useCallback, useEffect, useState, useRef } from 'react'
import StadiumCardSkeleton from './StadiumCardSkeleton'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@heroui/button'
import { Pagination } from '@heroui/pagination'
import { MdSportsSoccer } from 'react-icons/md'
import { useTypedTranslations } from '@/utils/i18n'

interface Stadium {
  id: string;
  name: string;
  address: string;
  googleMapsUrl: string | null;
  monthlyPrice: string | null;
  pricePerSession: string | null;
  image: string | null;
  sports: {
    id: string;
    nameAr: string;
    nameFr: string;
    icon: string | null;
  }[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ApiResponse {
  stadiums: Stadium[];
  pagination: PaginationInfo;
}

const StadiumsClientPage = () => {
  const t = useTypedTranslations()
  const searchParams = useSearchParams()
  const router = useRouter()
  const abortControllerRef = useRef<AbortController | null>(null)
  const filtersSectionRef = useRef<HTMLDivElement>(null)

  const [stadiums, setStadiums] = useState<Stadium[]>([])
  const [name, setName] = useState(() => {
    return searchParams.get('name') || ''
  })
  const [sportsId, setSportsId] = useState<string[]>(() => {
    const sportsParams = searchParams.get("sports")
    return sportsParams ? sportsParams.split(',').filter(Boolean) : []
  })
  const [page, setPage] = useState(() => {
    return parseInt(searchParams.get('page') || '1')
  })
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update URL without navigation
  const updateUrl = useCallback((newPage?: number) => {
    const params = new URLSearchParams()

    if (name) params.set('name', name)
    if (sportsId.length > 0) {
      params.set('sports', sportsId.join(','))
    }
    if (newPage !== undefined) {
      params.set('page', newPage.toString())
    } else {
      params.set('page', page.toString())
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, '', newUrl)
  }, [name, sportsId, page])

  // Scroll to filters section
const scrollToFilters = useCallback(() => {
  if (filtersSectionRef.current) {
    const offset = 80; // 80px for header
    
    // Calculate position
    const top = filtersSectionRef.current.offsetTop - offset;
    
    // Scroll to position
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  }
}, []);
  // Fetch stadiums with pagination
  const fetchStadiums = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (name) params.set('name', name)
      if (sportsId.length > 0) params.set('sports', sportsId.join(','))
      params.set('page', page.toString())
      params.set('limit', '12') // Set items per page

      const response = await fetch(`/api/public/stadiums?${params.toString()}`, {
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      setStadiums(data.stadiums)
      setPagination(data.pagination)
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error fetching stadiums:', error)
        setError('Failed to load stadiums. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [name, sportsId, page])

  // Update URL and fetch when filters change
  useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1)
    updateUrl(1)
  }, [name, sportsId])

  // Fetch stadiums when page or filters change
  useEffect(() => {
    fetchStadiums()
  }, [fetchStadiums])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleNameChange = (newName: string) => {
    setName(newName)
  }

  const handleSportsIdChange = (newSportsId: string[]) => {
    setSportsId(newSportsId)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    updateUrl(newPage)
    // Scroll to filters section when page changes
    scrollToFilters()
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Section with ref */}
        <div ref={filtersSectionRef} className="mb-12">
          <StadiumFilters
            name={name}
            sportsId={sportsId}
            handleNameChange={handleNameChange}
            handelSportsIdChange={handleSportsIdChange}
          />
        </div>

        {/* Results */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                {t('pages.stadiums.results.title')}
              </h2>
              {!loading && stadiums.length > 0 && (
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {t('pages.stadiums.pagination.showing')} {((page - 1) * pagination.limit) + 1} - {Math.min(page * pagination.limit, pagination.total)} {t('pages.stadiums.pagination.of')} {pagination.total} {t('pages.stadiums.pagination.stadiums')}
                </p>
              )}
            </div>

            {!loading && stadiums.length === 0 && !error && (
              <Button
                variant="light"
                onPress={() => {
                  setName('')
                  setSportsId([])
                  setPage(1)
                  // Scroll to top after clearing filters
                  scrollToFilters()
                }}
              >
                {t('pages.stadiums.results.clearFilters')}
              </Button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
            rounded-xl p-6 text-center mb-6">
              <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
              <Button
                color="danger"
                variant="flat"
                className="mt-3"
                onPress={fetchStadiums}
              >
                {t('pages.stadiums.results.error.retry')}
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <StadiumCardSkeleton key={i} />
              ))}
            </div>
          ) : stadiums.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {stadiums.map((stadium) => (
                  <StadiumCard key={stadium.id} stadium={stadium} />
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    total={pagination.totalPages}
                    page={page}
                    onChange={handlePageChange}
                    showControls
                    showShadow
                    color="warning"
                    size="lg"
                    classNames={{
                      wrapper: "gap-2",
                      item: "w-8 h-8 text-sm",
                      cursor: "bg-warning-500 text-white font-semibold"
                    }}
                  />
                </div>
              )}
            </>
          ) : !error ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center 
              rounded-full bg-gray-100 dark:bg-zinc-800">
                <MdSportsSoccer className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('pages.stadiums.results.noResults.title')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {t('pages.stadiums.results.noResults.description')}
              </p>
              <Button
                color="primary"
                variant="flat"
                onPress={() => {
                  setName('')
                  setSportsId([])
                  setPage(1)
                  // Scroll to top after resetting filters
                  scrollToFilters()
                }}
              >
                {t('pages.stadiums.results.noResults.resetFilters')}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default StadiumsClientPage