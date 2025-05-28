'use client'

import { useParams } from 'next/navigation'
import React from 'react'

const TaskPage = () => {
  const {taskId} = useParams()

  return (
    <div>Task Page {taskId}</div>
  )
}

export default TaskPage