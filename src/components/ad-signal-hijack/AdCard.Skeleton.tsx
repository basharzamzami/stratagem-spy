import { Skeleton } from "@/components/ui/skeleton";

export default function AdCardSkeleton() {
  return (
    <div className="p-4 border border-border rounded-lg">
      <div className="flex gap-4">
        <Skeleton className="w-40 h-24 rounded" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
