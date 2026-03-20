"use client"

import type { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { DeliveryRetail, DirectionRetail, StatusRetail } from "@prisma/client"
import { type Resolver, useForm } from "react-hook-form"
import { RetailFormSchema, type RetailSchema } from "@/entities/deal/model/schema"
import type { DealRetail } from "@/entities/deal/types"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { formatterCurrency } from "@/shared/lib/utils"
import { useMutationUpdateRetail } from "../../api/hooks/mutate"
import RetailFormBody from "./RetailFormBody"

const formatCurrency = (value: string | null | undefined): string => {
  return formatterCurrency.format(parseFloat(value || "0"))
}

type Props = {
  close: Dispatch<SetStateAction<void>>
  isInvalidate: boolean
  titleForm: string
  dealInfo: DealRetail
}

const EditRetailForm = ({ close, dealInfo, isInvalidate = false, titleForm }: Props) => {
  const { authUser } = useStoreUser()

  const form = useForm<RetailSchema>({
    resolver: zodResolver(RetailFormSchema) as Resolver<RetailSchema>,
    defaultValues: {
      ...dealInfo,
      phone: dealInfo.phone ?? undefined,
      email: dealInfo.email ?? undefined,
      dateRequest: dealInfo.dateRequest?.toISOString(),
      deliveryType: dealInfo.deliveryType as DeliveryRetail,
      dealStatus: dealInfo.dealStatus as StatusRetail,
      direction: dealInfo.direction as DirectionRetail,
      lastDateConnection: dealInfo.lastDateConnection?.toISOString(),
      commentsLastConnection: dealInfo.commentsLastConnection ?? "",
      plannedDateConnection: dealInfo.plannedDateConnection?.toISOString(),
      amountCP: formatCurrency(dealInfo.amountCP),
      delta: formatCurrency(dealInfo.delta),
      resource: dealInfo.resource ?? "",
      contacts: dealInfo?.additionalContacts ?? [],
      managersIds: Array.isArray(dealInfo.managers)
        ? dealInfo.managers.map((manager) => ({ userId: manager.id }))
        : [],
      inn: dealInfo.inn ?? "",
    },
  })

  const { mutateAsync, isPending } = useMutationUpdateRetail(
    dealInfo.id,
    dealInfo?.userId ?? "",
    close,
    isInvalidate,
  )

  const onSubmit = (data: RetailSchema) => {
    TOAST.PROMISE(mutateAsync(data), "Данные обновлены")
  }

  return (
    <RetailFormBody
      contactsKey="contacts"
      form={form}
      isPending={isPending}
      key={dealInfo.id}
      managerId={dealInfo?.userId || authUser?.id}
      onSubmit={onSubmit}
      titleForm={titleForm}
    />
  )
}

export default EditRetailForm
