import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[0,1,2,3].map((i) => (
        <div key={i} className="p-6 border border-border rounded-lg">
          <Skeleton className="h-5 w-48 mb-4" />
          <Skeleton className="h-36 w-full" />
        </div>
      ))}
    </div>
  );
}
