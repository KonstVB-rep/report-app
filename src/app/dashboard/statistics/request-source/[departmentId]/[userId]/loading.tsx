const loading = () => {
  return (
    <div className="grid gap-5 p-5">
      <div className="h-10 w-full animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />
      <div className="h-16 w-full animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />
      <div className="h-10 w-full animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />
      <div className="grid sm:grid-cols-2 gap-2">
        <div className="h-60 w-full animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />
        <div className="h-60 w-full animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />
      </div>
    </div>
  )
}

export default loading
