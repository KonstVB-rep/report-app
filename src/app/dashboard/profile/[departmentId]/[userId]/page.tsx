"use client"

import dynamic from "next/dynamic"
import z from "zod"
import { DepartmentLabels } from "@/entities/department/lib/constants"
import { useGetUser } from "@/feature/user/hooks/query"
import Contacts from "@/shared/custom-components/ui/Contacts"
import UserCard from "@/shared/custom-components/ui/UserCard"
import { useTypedParams } from "@/shared/hooks/useTypedParams"
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard"
import ProfileDealsData from "./ui/ProfileDealsData"

const AccessDeniedMessage = dynamic(
  () => import("@/shared/custom-components/ui/AccessDeniedMessage"),
  { ssr: false },
)

const Loading = dynamic(() => import("./loading"), { ssr: false })

const NotFoundUser = dynamic(() => import("./ui/NotFoundUser"), { ssr: false })

const pageParamsSchema = z.object({
  userId: z.string(),
})

const ProfilePage = () => {
  const { userId } = useTypedParams(pageParamsSchema)

  const { data: user, error, isPending } = useGetUser(userId)

  if (isPending) return <Loading />

  if (error) {
    return <AccessDeniedMessage error={error} />
  }

  if (!user) {
    return <NotFoundUser />
  }

  return (
    <section className="p-4 flex gap-2 flex-wrap">
      <div className="flex gap-4">
        <div className="grid auto-cols-max items-center gap-2 rounded-md border p-2 sm:grid-cols-[auto auto]">
          <div className="flex flex-col justify-between gap-2">
            <UserCard
              departmentName={
                DepartmentLabels[user?.departmentName as keyof typeof DepartmentLabels]
              }
              position={user?.position}
              username={user?.username}
            />

            <div className="flex flex-col gap-2">
              <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                <span className="first-letter:capitalize">Дата регистрации:</span>
                <span>{user?.createdAt?.toLocaleDateString()}</span>
              </p>

              <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                <span className="first-letter:capitalize">Тел.:</span>
                <span>{user?.phone}</span>
              </p>

              <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                <span className="first-letter:capitalize">Email:</span>
                <span className="break-all">{user?.email}</span>
              </p>
            </div>

            <div className="flex gap-2 rounded-md w-full items-center ">
              <Contacts className="rounded-full" email={user?.email} phone={user?.phone} />
            </div>
          </div>

          {/* 
          <div className="flex gap-2 overflow-hidden rounded-md w-full items-center">
            <Contacts
              className="rounded-full"
              email={user?.email}
              phone={user?.phone}
            />
          </div> 
          */}

          {/*
           <div className="flex flex-col gap-2 h-full">
            <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
              <span className="first-letter:capitalize">Дата регистрации:</span>
              <span>{user?.createdAt?.toLocaleDateString()}</span>
            </p>

            <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
              <span className="first-letter:capitalize">Тел.:</span>
              <span>{user?.phone}</span>
            </p>
            <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
              <span className="first-letter:capitalize">Email:</span>

              <span>{user?.email}</span>
            </p>
          </div> 
          */}
        </div>
      </div>

      <ProfileDealsData user={user} />
    </section>
  )
}

export default withAuthGuard(ProfilePage)
