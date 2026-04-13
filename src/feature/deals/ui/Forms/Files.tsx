import type { DealType } from "@prisma/client"
import dynamic from "next/dynamic"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"
import { useRequireAuth } from "@/shared/hooks/useRequireAuth"
import FileUploadForm from "@/widgets/Files/ui/UploadFile"

const FileList = dynamic(() => import("@/widgets/Files/ui/FileList"), {
  ssr: false,
  loading: () => <LoaderCircle className="h-20 bg-muted rounded-md w-full px-4" />,
})

const PreviewImagesList = dynamic(() => import("@/widgets/Files/ui/PreviewImages"), {
  ssr: false,
  loading: () => <LoaderCircle className="h-20 bg-muted rounded-md w-full px-4" />,
})

const Files = ({
  dataDeal,
}: {
  dataDeal: {
    id: string
    type: DealType
    userId?: string | null
  }
}) => {
  const authUser = useRequireAuth()
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end border p-1 rounded-xl">
        <FileUploadForm
          dealId={dataDeal?.id as string}
          dealType={dataDeal?.type === "RETAIL" ? "RETAIL" : "PROJECT"}
          userId={dataDeal?.userId || authUser.id}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <FileList
          data={{
            userId: dataDeal?.userId || null,
            dealId: dataDeal?.id as string,
            dealType: dataDeal?.type as DealType,
          }}
        />
        <PreviewImagesList
          data={{
            userId: dataDeal?.userId || null,
            dealId: dataDeal?.id as string,
            dealType: dataDeal?.type as DealType,
          }}
        />
      </div>
    </div>
  )
}

export default Files
