"use client";

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-gray-200 rounded-xl skeleton ${className}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="aspect-[3/4] bg-gray-200 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded skeleton w-3/4" />
        <div className="h-3 bg-gray-200 rounded skeleton w-1/2" />
        <div className="h-6 bg-gray-200 rounded skeleton w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="w-full h-64 md:h-96 bg-gray-200 rounded-2xl skeleton" />
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-gray-200 skeleton" />
          <div className="h-3 bg-gray-200 rounded skeleton w-16" />
        </div>
      ))}
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-100">
      <div className="w-12 h-12 bg-gray-200 rounded-lg skeleton" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded skeleton w-1/3" />
        <div className="h-3 bg-gray-200 rounded skeleton w-1/4" />
      </div>
      <div className="h-6 w-20 bg-gray-200 rounded-full skeleton" />
    </div>
  );
}
