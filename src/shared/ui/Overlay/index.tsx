import React from 'react'

const Overlay = ({className = '', isPending}: {className?: string, isPending: boolean}) => {
  if(!isPending) return null;
  return (
    <div className={`fixed inset-0 border border-solid bg-black/50 z-50 ${className}`}/>
  )
}

export default Overlay