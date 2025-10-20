import { memo } from "react"
import { TableProperties } from "lucide-react"
import Link from "next/link"
import type { UserResponse } from "@/entities/user/types"
import { Button } from "@/shared/components/ui/button"
import Contacts from "@/shared/custom-components/ui/Contacts"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import TooltipComponent from "@/shared/custom-components/ui/TooltipComponent"

const ProfileLink = ({
  id,
  departmentId,
  username,
  position,
  className = "",
}: {
  id: string
  departmentId: number
  username: string
  position?: string
  className?: string
}) => (
  <Link
    className={`flex w-full sm:w-60 flex-col items-center justify-center rounded-md border border-solid px-4 py-2 ${className}`}
    href={`/dashboard/profile/${departmentId}/${id}`}
    prefetch={false}
    title={`${username.toUpperCase()} - Перейти в профиль`}
  >
    <span className="capitalize truncate overflow-hidden text-ellipsis whitespace-nowrap w-full text-center">
      {username}
    </span>
    {position && <span className="text-xs first-letter:capitalize">{position}</span>}
  </Link>
)

const TableLinks = ({ departmentId, id }: { departmentId: number; id: string }) => (
  <div className="flex gap-2 shrink-0 w-full sm:w-auto">
    <TooltipComponent content="Перейти к проектам">
      <Link
        className="h-14 flex flex-1 sm:aspect-square sm:max-w-fit items-center justify-center rounded-md border hover:bg-muted-foreground/50"
        href={`/dashboard/table/${departmentId}/projects/${id}`}
        prefetch={false}
        rel="noopener noreferrer"
      >
        <TableProperties />
      </Link>
    </TooltipComponent>
    <TooltipComponent content="Перейти к розничным сделкам">
      <Link
        className="h-14 flex flex-1 sm:aspect-square sm:max-w-fit items-center justify-center rounded-md border hover:bg-muted-foreground/50"
        href={`/dashboard/table/${departmentId}/retails/${id}`}
        prefetch={false}
        rel="noopener noreferrer"
      >
        <TableProperties />
      </Link>
    </TooltipComponent>
  </div>
)

const UserItem = memo(({ id, username, position, departmentId, email, phone }: UserResponse) => {
  const usernameFormatted = username.split(" ").join(" ")

  if (departmentId === 1) {
    return (
      <>
        <li className="hidden sm:flex flex-wrap gap-2" key={id}>
          <ProfileLink
            departmentId={departmentId}
            id={id}
            position={position}
            username={usernameFormatted}
          />
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="flex gap-2 overflow-hidden rounded-md shrink-0 w-full sm:w-auto">
              <Contacts className="rounded-md" email={email} phone={phone} />
            </div>
            <TableLinks departmentId={departmentId} id={id} />
          </div>
        </li>

        <li className="sm:hidden">
          <DialogComponent
            classNameContent="rounded-md pt-10"
            contentTooltip={`${usernameFormatted.toUpperCase()} - Перейти в профиль`}
            trigger={
              <Button
                className="flex h-14 w-full sm:w-60 flex-col items-center justify-center rounded-md border border-solid px-4 py-2"
                variant="outline"
              >
                <span className="capitalize truncate overflow-hidden text-ellipsis whitespace-nowrap w-full text-center">
                  {usernameFormatted}
                </span>
                <span className="text-xs first-letter:capitalize">{position}</span>
              </Button>
            }
          >
            <ProfileLink departmentId={departmentId} id={id} username={usernameFormatted} />
            <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-2">
              <div className="flex gap-2 overflow-hidden rounded-md shrink-0 w-full sm:w-auto">
                <Contacts className="rounded-md" email={email} phone={phone} />
              </div>
              <TableLinks departmentId={departmentId} id={id} />
            </div>
          </DialogComponent>
        </li>
      </>
    )
  }

  if (departmentId === 2) {
    return (
      <>
        <li className="hidden sm:flex flex-wrap gap-2" key={id}>
          <ProfileLink
            departmentId={departmentId}
            id={id}
            position={position}
            username={usernameFormatted}
          />
          <div className="flex gap-2 overflow-hidden rounded-md shrink-0 w-full sm:w-auto">
            <Contacts className="rounded-md" email={email} phone={phone} />
          </div>
        </li>

        <li className="sm:hidden">
          <DialogComponent
            classNameContent="rounded-md pt-10"
            contentTooltip={`${usernameFormatted.toUpperCase()} - Перейти в профиль`}
            trigger={
              <Button
                className="flex h-14 w-full sm:w-60 flex-col items-center justify-center rounded-md border border-solid px-4 py-2"
                variant="outline"
              >
                <span className="capitalize truncate overflow-hidden text-ellipsis whitespace-nowrap w-full text-center">
                  {usernameFormatted}
                </span>
                <span className="text-xs first-letter:capitalize">{position}</span>
              </Button>
            }
          >
            <ProfileLink departmentId={departmentId} id={id} username={usernameFormatted} />
            <div className="flex gap-2 overflow-hidden rounded-md shrink-0 w-full sm:w-auto mt-2">
              <Contacts className="rounded-md" email={email} phone={phone} />
            </div>
          </DialogComponent>
        </li>
      </>
    )
  }

  return null
})

UserItem.displayName = "UserItem"

export default UserItem
