// Skeleton component for premium loading states
export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export function Skeleton({ className = '', width, height, borderRadius }: SkeletonProps) {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || '20px', 
        borderRadius: borderRadius || 'var(--radius-sm)' 
      }}
    />
  );
}

export function ProductSkeleton() {
  return (
    <div className="glass-card p-8 h-[500px] flex flex-col justify-end gap-4">
      <div className="flex flex-col gap-4">
        <div>
          <Skeleton width="40%" height="12px" className="mb-2" />
          <Skeleton width="80%" height="24px" className="mb-2" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton width="30%" height="20px" />
          <Skeleton width="80px" height="36px" borderRadius="var(--radius-full)" />
        </div>
      </div>
    </div>
  );
}
