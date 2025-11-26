import { memo } from "react"

type UserCardProps = {
  username: string
  position: string
  isLink?: boolean
  departmentName: string
}

const UserCard = ({ username, position, isLink = false, departmentName }: UserCardProps) => {
  const styles = isLink ? "border border-solid rounded-md" : ""

  return (
    <div className={`${styles} text-sm`}>
      <div className="flex flex-col w-full gap-2">
        <p className="h-[42px] capitalize text-xl bg-muted rounded-md w-full flex items-center justify-center p-1">
          {username}
        </p>
        <p className="h-[42px] uppercase bg-muted rounded-md w-full flex items-center justify-center font-semibold p-1">
          {departmentName}
        </p>
        <p className="h-[42px] uppercase bg-muted rounded-md w-full flex items-center justify-center font-semibold p-1">
          {position}
        </p>
      </div>
    </div>
  )
}

export default memo(UserCard)
