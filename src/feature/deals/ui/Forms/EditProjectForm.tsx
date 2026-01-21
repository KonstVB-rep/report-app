import { type Dispatch, type SetStateAction, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { DeliveryProject, DirectionProject, StatusProject } from "@prisma/client"
import { type Resolver, useForm } from "react-hook-form"
import { formatNumberCurrency } from "@/entities/deal/lib/helpers"
import { ProjectFormSchema, type ProjectSchema } from "@/entities/deal/model/schema"
import FormDealSkeleton from "@/entities/deal/ui/Skeletons/FormDealSkeleton"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { useMutationUpdateProject } from "../../api/hooks/mutate"
import { useGetProjectById } from "../../api/hooks/query"
import { defaultProjectValues } from "../../model/defaultvaluesForm"
import ProjectFormBody from "./ProjectFormBody"

type Props = {
  close: Dispatch<SetStateAction<void>>
  dealId: string
  isInvalidate: boolean
  titleForm: string
}

const EditProjectForm = ({ close, dealId, isInvalidate = false, titleForm }: Props) => {
  const { data, isPending: isLoading } = useGetProjectById(dealId, false)
  const { authUser } = useStoreUser()

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectFormSchema) as Resolver<ProjectSchema>,
    defaultValues: defaultProjectValues,
  })

  const { mutateAsync, isPending } = useMutationUpdateProject(
    dealId,
    data?.userId ?? "",
    close,
    isInvalidate,
  )

  const onSubmit = (data: ProjectSchema) => {
    TOAST.PROMISE(mutateAsync(data), "Данные обновлены")
  }

  const { reset } = form

  useEffect(() => {
    if (data && !isLoading) {
      reset({
        ...data,
        phone: data.phone ?? undefined,
        email: data.email ?? undefined,
        dateRequest: data.dateRequest?.toISOString(),
        deliveryType: (data.deliveryType as DeliveryProject) || undefined,
        dealStatus: data.dealStatus as StatusProject,
        direction: data.direction as DirectionProject,
        plannedDateConnection: data.plannedDateConnection?.toISOString(),
        amountCP: formatNumberCurrency(data.amountCP),
        amountPurchase: formatNumberCurrency(data.amountPurchase),
        amountWork: formatNumberCurrency(data.amountWork),
        delta: data.delta,
        resource: data.resource ?? "",
        contacts: data.additionalContacts ?? [],
        managersIds: Array.isArray(data.managers)
          ? data.managers.map((manager) => ({ userId: manager.id }))
          : [],
      })
    }
  }, [data, reset, isLoading])

  if (isLoading) return <FormDealSkeleton />

  return (
    <ProjectFormBody
      contactsKey="contacts"
      form={form}
      isPending={isPending}
      managerId={data?.userId || authUser?.id}
      onSubmit={onSubmit}
      titleForm={titleForm}
    />
  )
}

export default EditProjectForm
