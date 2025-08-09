
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-4">
        <CardContent className="p-0">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </CardContent>
      </Card>
      
      <Card className="p-4">
        <CardContent className="p-0">
          <Skeleton className="h-4 w-28 mb-4" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </CardContent>
      </Card>
      
      <Card className="p-4">
        <CardContent className="p-0">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </CardContent>
      </Card>
      
      <Card className="p-4">
        <CardContent className="p-0">
          <Skeleton className="h-4 w-36 mb-4" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
}
