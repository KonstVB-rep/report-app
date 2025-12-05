const DealsSkeleton = () => {
  return (
    <section className="h-full p-4">
      <div className="grid h-full grid-rows-[auto_1fr] content-start gap-4">
        <div className="h-10 w-full animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />

        <div className="h-full max-h-[79vh] min-h-[50vh] w-full animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />
      </div>
    </section>
  )
}

export default DealsSkeleton
