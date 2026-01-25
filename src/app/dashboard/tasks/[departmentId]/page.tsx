import TasksPageMain from "./TasksPageMain"

interface PageProps {
  params: {
    departmentId: string
  }
}

export default function Page({ params }: PageProps) {
  return <TasksPageMain departmentId={params.departmentId} />
}
