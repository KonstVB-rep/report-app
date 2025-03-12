import React from 'react'

const ProjectsSkeleton = () => {
  return (
    <section className="p-4 h-full">
      <div className="grid gap-4 h-full content-start grid-rows-[auto_auto_1fr]">
        <div className="flex justify-between items-center">
          <div className="h-10 w-40 rounded-xl bg-muted/50 animate-pulse" />
        </div>
        <div>
          <div className="h-10 w-40 rounded-xl bg-muted/50 animate-pulse" />
        </div>
        <div className="w-full h-full max-h-[80vh] rounded-xl bg-muted/50 animate-pulse" />
      </div>
    </section>
  )
}

export default ProjectsSkeleton