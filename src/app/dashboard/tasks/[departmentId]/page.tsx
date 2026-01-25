import TasksPageMain from "./TasksPageMain"

interface PageProps {
  params: Promise<{
    departmentId: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { departmentId } = await params
  return <TasksPageMain departmentId={departmentId} />
}
