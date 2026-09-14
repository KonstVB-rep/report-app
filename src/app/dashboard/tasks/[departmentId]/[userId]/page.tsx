export const instant = false

import UserTasksPage from "./UserTasksPage"

interface PageProps {
  params: Promise<{
    departmentId: string
    userId: string
  }>
}

const Page = async ({ params }: PageProps) => {
  const { departmentId, userId } = await params
  return <UserTasksPage departmentId={departmentId} userId={userId} />
}

export default Page
