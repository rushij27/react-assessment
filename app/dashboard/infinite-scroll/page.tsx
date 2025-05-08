"use client"

import { useEffect, useRef } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

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
      <div className="container mx-auto space-y-6 p-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Infinite Scroll
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-3">
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
      <div className="container mx-auto space-y-6 p-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Infinite Scroll
        </h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          <p className="text-lg">Error loading images. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-8 p-4">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Infinite Scroll
        </h1>
        <p className="text-xl text-muted-foreground">
          Scroll down to load more dog images
        </p>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          "sm:grid-cols-2",
          "lg:grid-cols-3",
          "xl:grid-cols-4"
        )}
      >
        {allImages.map((imageUrl, index) => (
          <Card 
            key={`${imageUrl}-${index}`}
            className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <CardContent className="p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={`Dog ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading indicator and intersection observer target */}
      <div 
        ref={loadMoreRef} 
        className="flex justify-center py-6"
      >
        {isFetchingNextPage && (
          <div className="flex items-center space-x-3 text-lg">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading more images...</span>
          </div>
        )}
      </div>
    </div>
  )
}
