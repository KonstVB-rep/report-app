import type { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { DeliveryProject, DirectionProject, StatusProject } from "@prisma/client"
import { type Resolver, useForm } from "react-hook-form"
import { formatNumberCurrency } from "@/entities/deal/lib/helpers"
import { ProjectFormSchema, type ProjectSchema } from "@/entities/deal/model/schema"
import type { DealProject } from "@/entities/deal/types"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { useMutationUpdateProject } from "../../api/hooks/mutate"
import ProjectFormBody from "./ProjectFormBody"

type Props = {
  close: Dispatch<SetStateAction<void>>
  dealInfo: DealProject
  isInvalidate: boolean
  titleForm: string
}

const EditProjectForm = ({ close, dealInfo, isInvalidate = false, titleForm }: Props) => {
  const { authUser } = useStoreUser()

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectFormSchema) as Resolver<ProjectSchema>,
    defaultValues: {
      ...dealInfo,
      phone: dealInfo.phone ?? undefined,
      email: dealInfo.email ?? undefined,
      dateRequest: dealInfo.dateRequest?.toISOString(),
      deliveryType: (dealInfo.deliveryType as DeliveryProject) || undefined,
      dealStatus: dealInfo.dealStatus as StatusProject,
      direction: dealInfo.direction as DirectionProject,
      lastDateConnection: dealInfo.lastDateConnection?.toISOString(),
      commentsLastConnection: "",
      plannedDateConnection: dealInfo.plannedDateConnection?.toISOString(),
      amountCP: formatNumberCurrency(dealInfo.amountCP),
      amountPurchase: formatNumberCurrency(dealInfo.amountPurchase),
      amountWork: formatNumberCurrency(dealInfo.amountWork),
      delta: dealInfo.delta,
      resource: dealInfo.resource ?? "",
      contacts: dealInfo.additionalContacts ?? [],
      managersIds: Array.isArray(dealInfo?.managers)
        ? dealInfo?.managers.map((manager) => ({ userId: manager.id }))
        : [],
      inn: dealInfo.inn ?? "",
    },
  })

  const { mutateAsync, isPending } = useMutationUpdateProject(
    dealInfo ? dealInfo.id : "",
    dealInfo?.userId ?? "",
    close,
    isInvalidate,
  )

  const onSubmit = (data: ProjectSchema) => {
    TOAST.PROMISE(mutateAsync(data), "Данные обновлены")
  }

  return (
    <ProjectFormBody
      contactsKey="contacts"
      form={form}
      isPending={isPending}
      managerId={dealInfo?.userId || authUser?.id}
      onSubmit={onSubmit}
      titleForm={titleForm}
    />
  )
}

export default EditProjectForm
