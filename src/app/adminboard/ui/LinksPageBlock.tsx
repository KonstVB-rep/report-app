import Link from "next/link"
import { usePathname } from "next/navigation"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { cn } from "@/shared/lib/utils"

const LinkPage = ({ path, title }: { path: string; title: string }) => {
  const pathname = usePathname()

  const isThisPath = pathname === path
  return (
    <Link
      className={cn(
        "flex items-center justify-between py-2 px-3 border w-full rounded-md bg-muted self-end",
        isThisPath && "border-blue-600",
      )}
      href={path}
      prefetch={false}
    >
      {title}
    </Link>
  )
}

const LinksPageBlock = () => {
  const { authUser } = useStoreUser()

  return (
    <div className="grid gap-3 self-end px-2 pb-2 w-full">
      <LinkPage path="/adminboard/bots" title="Боты" />

      <LinkPage path={`/adminboard/deals/${authUser?.id}`} title="Сделки" />

      <LinkPage path="/adminboard/events" title="Календарь" />
    </div>
  )
}

export default LinksPageBlock
