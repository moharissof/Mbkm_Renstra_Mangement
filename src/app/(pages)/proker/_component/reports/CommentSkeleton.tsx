import { Skeleton } from "@/components/ui/skeleton"

export default function CommentListSkeleton() {
  return (
    <div className="px-6 py-3 space-y-4">
      {/* Comment 1 */}
      <div className="flex items-start gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <div className="flex-1">
          <div className="bg-muted p-2 rounded-md">
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-1" />
          </div>
        </div>
      </div>

      {/* Comment 2 */}
      <div className="flex items-start gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <div className="flex-1">
          <div className="bg-muted p-2 rounded-md">
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-2/3 mt-1" />
          </div>
        </div>
      </div>

      {/* Comment 3 */}
      <div className="flex items-start gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <div className="flex-1">
          <div className="bg-muted p-2 rounded-md">
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-1/2 mt-1" />
          </div>
        </div>
      </div>
    </div>
  )
}

