"use client"

import { UserRound } from "lucide-react"
import Link from "next/link"
import type { User } from "../types"

type Props = {
  user: User
}

export function ProfileSettings({ user }: Props) {
  return (
    <Link
      aria-label={`Перейти в профиль пользователя ${user.username}`}
      className="btn_hover text-sm"
      href={`/dashboard/profile/${user.departmentId}/${user.id}`}
      title={`Перейти в профиль пользователя ${user.username}`}
    >
      <UserRound size="16" />{" "}
      <span className="flex w-full items-center gap-2 capitalize">{user.username}</span>
    </Link>
  )
}

export default ProfileSettings
