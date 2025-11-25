import z from "zod"
import ProfileSettings from "@/entities/user/ui/ProfileSettings"
import { useGetUser } from "@/feature/user/hooks/query"
import { useTypedParams } from "@/shared/hooks/useTypedParams"
import LinkToUserTable from "./LinkToUserTable"

const pageParamsSchema = z.object({
  userId: z.string(),
})

const ButtonsGroupTable = () => {
  const { userId } = useTypedParams(pageParamsSchema)

  const { data: user } = useGetUser(userId)

  if (!user) return null

  return (
    <div className="flex items-center justify-between gap-2">
      <ProfileSettings user={user} />

      <div className="flex gap-2">
        <LinkToUserTable />
      </div>
    </div>
  )
}

export default ButtonsGroupTable
