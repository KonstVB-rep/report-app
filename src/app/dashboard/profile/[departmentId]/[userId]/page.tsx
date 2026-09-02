import ProfilePageMain from "./ProfilePageMain"

interface PageProps {
  params: Promise<{
    userId: string
  }>
}

export const instant = false

export default async function ProfilePage({ params }: PageProps) {
  return <ProfilePageMain params={params} />
}
