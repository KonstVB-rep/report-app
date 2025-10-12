import { useState } from "react"
import type { DealType } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import IntoDealItem from "@/entities/deal/ui/IntoDealItem"
import { Button } from "@/shared/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"
import { useGetHrefFilesDealFromDB, useGetResourceInfo } from "@/widgets/Files/hooks/query"

type Props = {
  data: {
    userId: string
    dealId: string
    dealType: DealType
  } | null
}

const yandexDiskSupportedImages = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "tiff",
  "tif",
  "webp",
  "avif",
]
const LoaderFileX = () => (
  <div className="w-20 h-20 grid place-items-center">
    <LoaderCircle className="w-full h-full bg-muted" />
  </div>
)

const CarouselItemImage = ({ filePath }: { filePath: string }) => {
  const { data: fileData, isPending } = useGetResourceInfo(filePath)
  console.log(isPending, "isPending")

  if (isPending)
    return (
      <LoaderCircle className="bg-transparent w-full h-full" classSpin="opacity-50 w-[5%] h-[5%]" />
    )
  if (!fileData?.preview || fileData.media_type !== "image") return null

  return (
    <div className="relative h-full w-full">
      <Image
        alt={fileData.name}
        className="object-contain"
        fill={true}
        priority={true}
        quality={100}
        sizes="(max-width: 768px) 90vw, 80vw"
        src={fileData.sizes[0].url}
      />
    </div>
  )
}

const PreviewListItem = ({ filePath }: { filePath: string }) => {
  const { data: fileData, isPending } = useGetResourceInfo(filePath)

  console.log(fileData, "fileData")

  if (isPending) return <LoaderFileX />
  if (!fileData?.preview || fileData.media_type !== "image") return null

  return (
    <>
      <Link href={encodeURIComponent(fileData.file)}></Link>
      <Button className="relative p-0 h-[80px] w-[80px] rounded overflow-hidden top-0 left-0 transition-transform duraion-150 ease-in-out border-[2px] border-transparent hover:border-primary focus-visible:border-primary">
        <Image
          alt={fileData.name}
          className="object-cover rounded hover:scale-110 transition-transform duration-150"
          fill={true}
          quality={90}
          sizes="80px"
          src={fileData.file}
        />
      </Button>
    </>
  )
}

const PreviewImagesList = ({ data }: Props) => {
  const { data: files, isPending, isError } = useGetHrefFilesDealFromDB(data ? data : undefined)

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  if (!files || files?.length === 0) {
    return null
  }

  const filesImages = files.filter((file) => {
    const lastpoint = file.localPath.lastIndexOf(".") + 1
    return yandexDiskSupportedImages.includes(file.localPath.slice(lastpoint))
  })

  if (filesImages.length === 0) {
    return null
  }

  if (isPending) {
    return <LoaderFileX />
  }

  if (isError) {
    return <div>Произошла ошибка</div>
  }

  return (
    <IntoDealItem title="Галлерея">
      <div className="flex flex-wrap gap-2">
        {isPending && <LoaderFileX />}
        {isError && <div>Произошла ошибка</div>}

        {filesImages.map((file, index) => (
          <button
            className="cursor-pointer rounded-md border-none bg-transparent p-0"
            key={file.name}
            onClick={() => setSelectedImageIndex(index)}
            type="button"
          >
            <PreviewListItem filePath={file.localPath} />
          </button>
        ))}
      </div>

      <DialogComponent
        classNameContent="w-[90vw] sm:max-w-[90vw] h-[90vh] flex items-center justify-center"
        onOpenChange={(open) => !open && setSelectedImageIndex(null)}
        open={selectedImageIndex !== null}
      >
        {selectedImageIndex !== null && (
          <Carousel className="w-full h-full" opts={{ startIndex: selectedImageIndex }}>
            <CarouselContent className="h-full w-full">
              {filesImages.map((file) => (
                <CarouselItem className="h-full w-full" key={file.name}>
                  <div className="h-full flex items-center justify-center p-4">
                    <CarouselItemImage filePath={file.localPath} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-[10px]" />
            <CarouselNext className="right-[10px]" />
          </Carousel>
        )}
      </DialogComponent>
    </IntoDealItem>
  )
}

export default PreviewImagesList
