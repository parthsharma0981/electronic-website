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

export function ProductDetailSkeleton() {
  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start', paddingTop: '5rem' }}>
      <div style={{ position: 'relative', borderRadius: '1.25rem', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.08)', aspectRatio: '1' }}>
        <Skeleton height="100%" borderRadius="1.25rem" />
      </div>
      <div>
        <Skeleton width="30%" height="14px" className="mb-[0.75rem]" />
        <Skeleton width="80%" height="40px" className="mb-[1.5rem]" />
        <Skeleton width="40%" height="32px" className="mb-[1.5rem]" />
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Skeleton width="60px" height="20px" />
          <Skeleton width="120px" height="20px" />
        </div>
        <Skeleton height="100px" className="mb-[2rem]" borderRadius="0.5rem" />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Skeleton height="45px" borderRadius="0.75rem" />
          <Skeleton height="45px" borderRadius="0.75rem" />
        </div>
      </div>
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div style={{ borderRadius: '1.5rem', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <Skeleton width="100px" height="12px" className="mb-[0.5rem]" />
          <Skeleton width="140px" height="14px" />
        </div>
        <Skeleton width="80px" height="24px" borderRadius="9999px" />
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <Skeleton width="50px" height="50px" borderRadius="0.75rem" />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" height="16px" className="mb-[0.25rem]" />
          <Skeleton width="30%" height="12px" />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Skeleton width="120px" height="24px" />
        <Skeleton width="100px" height="16px" />
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div style={{ display: 'flex', gap: '1rem', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem', marginBottom: '1rem' }}>
      <Skeleton width="100px" height="100px" borderRadius="1rem" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Skeleton width="70%" height="20px" className="mb-[0.5rem]" />
        <Skeleton width="40%" height="14px" className="mb-[1rem]" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton width="120px" height="36px" borderRadius="9999px" />
          <Skeleton width="80px" height="24px" />
        </div>
      </div>
    </div>
  );
}
