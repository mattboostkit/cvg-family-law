import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: "default" | "circular" | "rectangular" | "text";
}

export function Skeleton({
  className,
  width,
  height,
  variant = "default"
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200";

  const variantClasses = {
    default: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    text: "rounded h-4"
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
    />
  );
}

// Pre-built skeleton components for common use cases
export function SkeletonText({
  lines = 1,
  className,
  width
}: {
  lines?: number;
  className?: string;
  width?: string | string[];
}) {
  const resolvedWidth = Array.isArray(width) ? width[0] : width;

  if (lines === 1) {
    return (
      <Skeleton
        variant="text"
        className={cn("w-full", className)}
        width={resolvedWidth}
      />
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={Array.isArray(width) ? (width[i] || "100%") : (i === lines - 1 ? "75%" : "100%")}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white border rounded-lg p-6 space-y-4", className)}>
      <Skeleton variant="rectangular" height={200} className="w-full" />
      <SkeletonText lines={2} />
      <div className="flex space-x-2">
        <Skeleton variant="default" width={80} height={32} />
        <Skeleton variant="default" width={100} height={32} />
      </div>
    </div>
  );
}

export function SkeletonAvatar({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function SkeletonButton({ className, width = 120, height = 40 }: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <Skeleton
      variant="default"
      width={width}
      height={height}
      className={cn("rounded-md", className)}
    />
  );
}

export function SkeletonHeader({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 mb-6", className)}>
      <Skeleton variant="text" className="h-8 w-64" />
      <Skeleton variant="text" className="h-4 w-96" />
    </div>
  );
}

export function SkeletonForm({ fields = 3, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" className="h-4 w-24" />
          <Skeleton variant="rectangular" height={40} className="w-full" />
        </div>
      ))}
      <SkeletonButton width={100} className="mt-6" />
    </div>
  );
}