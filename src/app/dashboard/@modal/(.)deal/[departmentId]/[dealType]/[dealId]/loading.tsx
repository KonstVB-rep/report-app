"use client"

const Loading = () => {
  const largeBlock = <div className="h-32 animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />
  const smallBlock = <div className="h-24 animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />

  return (
    <section className="grid p-4">
      <div className="h-20 w-full animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />

      <div className="grid gap-2 py-2">
        {[0, 1].map((i) => (
          <div className="grid grid-cols-[0.4fr_1fr] gap-2" key={i}>
            {largeBlock}

            {largeBlock}
          </div>
        ))}

        {smallBlock}

        {smallBlock}
      </div>
    </section>
  )
}

export default Loading
