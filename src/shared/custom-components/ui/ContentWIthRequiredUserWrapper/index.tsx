"use client"

import useStoreUser from "@/entities/user/store/useStoreUser"

const ContentWIthRequiredUserWrapper = ({ children }: { children: React.ReactNode }) => {
  const authUser = useStoreUser((s) => s.authUser)

  if (!authUser) return null

  return <>{children}</>
}

export default ContentWIthRequiredUserWrapper
