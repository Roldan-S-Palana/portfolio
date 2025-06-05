// src/components/DashboardSkeleton.jsx
import Skeleton from './Skeleton';

const DashboardSkeleton = () => {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-6 w-1/2" /> {/* Heading */}
      <Skeleton className="h-4 w-1/3" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
