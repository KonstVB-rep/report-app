"use client"

import { type Dispatch, type SetStateAction, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { DeliveryRetail, DirectionRetail, StatusRetail } from "@prisma/client"
import { type Resolver, useForm } from "react-hook-form"
import { RetailFormSchema, type RetailSchema } from "@/entities/deal/model/schema"
import FormDealSkeleton from "@/entities/deal/ui/Skeletons/FormDealSkeleton"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { formatterCurrency } from "@/shared/lib/utils"
import { useMutationUpdateRetail } from "../../api/hooks/mutate"
import { useGetRetailById } from "../../api/hooks/query"
import { defaultRetailValues } from "../../model/defaultvaluesForm"
import RetailFormBody from "./RetailFormBody"

const formatCurrency = (value: string | null | undefined): string => {
  return formatterCurrency.format(parseFloat(value || "0"))
}

type Props = {
  close: Dispatch<SetStateAction<void>>
  dealId: string
  isInvalidate: boolean
  titleForm: string
}

const EditRetailForm = ({ close, dealId, isInvalidate = false, titleForm }: Props) => {
  const { data, isPending: isLoading } = useGetRetailById(dealId, false)
  const { authUser } = useStoreUser()

  const form = useForm<RetailSchema>({
    resolver: zodResolver(RetailFormSchema) as Resolver<RetailSchema>,
    defaultValues: defaultRetailValues,
  })

  const { mutateAsync, isPending } = useMutationUpdateRetail(
    dealId,
    data?.userId ?? "",
    close,
    isInvalidate,
  )

  const onSubmit = (data: RetailSchema) => {
    TOAST.PROMISE(mutateAsync(data), "Данные обновлены")
  }

  const { reset } = form

  useEffect(() => {
    if (data && !isLoading) {
      const formattedData = {
        ...data,
        phone: data.phone ?? undefined,
        email: data.email ?? undefined,
        dateRequest: data.dateRequest?.toISOString(),
        deliveryType: data.deliveryType as DeliveryRetail,
        dealStatus: data.dealStatus as StatusRetail,
        direction: data.direction as DirectionRetail,
        plannedDateConnection: data.plannedDateConnection?.toISOString(),
        amountCP: formatCurrency(data.amountCP),
        delta: formatCurrency(data.delta),
        resource: data.resource ?? "",
        contacts: data?.additionalContacts ?? [],
        managersIds: Array.isArray(data.managers)
          ? data.managers.map((manager) => ({ userId: manager.id }))
          : [],
      }
      reset(formattedData)
    }
  }, [reset, data, isLoading])

  if (isLoading) return <FormDealSkeleton />
  if (!data) return null

  return (
    <RetailFormBody
      contactsKey="contacts"
      form={form}
      isPending={isPending}
      key={dealId}
      managerId={data?.userId || authUser?.id}
      onSubmit={onSubmit}
      titleForm={titleForm}
    />
  )
}

export default EditRetailForm
