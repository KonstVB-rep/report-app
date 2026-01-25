import ProfilePageMain from "./ProfilePageMain"

interface PageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params
  return <ProfilePageMain userId={userId} />
}
