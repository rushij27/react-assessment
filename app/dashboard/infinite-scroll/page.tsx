"use client"

import { useEffect, useRef } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

// Function to fetch dog images
const fetchDogImages = async ({ pageParam = 1 }) => {
  const response = await fetch(`https://dog.ceo/api/breeds/image/random/5`)
  const data = await response.json()
  return {
    images: data.message,
    nextPage: pageParam + 1,
  }
}

export default function InfiniteScrollPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["dogImages"],
    queryFn: fetchDogImages,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })

  useEffect(() => {
    // Set up intersection observer to detect when user scrolls to bottom
    if (loadMoreRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        },
        { threshold: 0.1 },
      )

      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  // Flatten all images from all pages
  const allImages = data?.pages.flatMap((page) => page.images) || []

  if (status === "pending") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Infinite Scroll</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Skeleton className="h-[200px] w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Infinite Scroll</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          <p>Error loading images. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Infinite Scroll</h1>
      <p className="text-muted-foreground">Scroll down to load more dog images</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allImages.map((imageUrl, index) => (
          <Card key={`${imageUrl}-${index}`}>
            <CardContent className="p-4">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={`Dog ${index + 1}`}
                className="h-[200px] w-full rounded-md object-cover"
                loading="lazy"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading indicator and intersection observer target */}
      <div ref={loadMoreRef} className="flex justify-center py-4">
        {isFetchingNextPage && (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more...</span>
          </div>
        )}
      </div>
    </div>
  )
}
