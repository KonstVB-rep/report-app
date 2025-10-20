const DelDealSkeleton = () => {
  return (
    <div className="w-full h-full">
      <div className="grid gap-4 py-4">
        <div className="h-10 w-60 bg-muted animate-pulse rounded-md m-auto" />
        <div className="h-20 w-full bg-muted animate-pulse rounded-md" />
        <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-12 bg-muted animate-pulse rounded-md" />
          <div className="h-12 bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  )
}

export default DelDealSkeleton
