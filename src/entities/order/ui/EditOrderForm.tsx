// import { zodResolver } from "@hookform/resolvers/zod";
// import { DeliveryRetail, DirectionRetail, StatusOrder, StatusRetail } from "@prisma/client";

// import React, { Dispatch, SetStateAction, useEffect } from "react";
// import { useForm } from "react-hook-form";

// import { formatterCurrency } from "@/shared/lib/utils";
// import { TOAST } from "@/shared/ui/Toast";

// // import { useMutationUpdateRetail } from "../../hooks/mutate";
// // import { useGetRetailById } from "../../hooks/query";

// import OrderFormBody from "./OrderFormBody";
// import { RetailSchema } from "@/entities/deal/model/schema";
// import FormDealSkeleton from "@/entities/deal/ui/Skeletons/FormDealSkeleton";
// import { defaultOrderValues } from "../lib/constants";
// import { OrderSchema, OrderFormSchema } from "../model/shema";

// const formatCurrency = (value: string | null | undefined): string => {
//   return formatterCurrency.format(parseFloat(value || "0"));
// };

// const EditOrderForm = ({
//   close,
//   dealId,
// }: {
//   close: Dispatch<SetStateAction<void>>;
//   dealId: string;
// }) => {
//   const { data, isPending: isLoading } = useGetRetailById(dealId, false);

//   const form = useForm<OrderSchema>({
//     resolver: zodResolver(OrderFormSchema),
//     defaultValues: defaultOrderValues,
//   });

//   const { mutateAsync, isPending } = useMutationUpdateRetail(
//     dealId,
//     data?.userId ?? "",
//     close
//   );

//   const onSubmit = (data: RetailSchema) => {
//     TOAST.PROMISE(mutateAsync(data), "Данные обновлены");
//   };

//   useEffect(() => {
//     if (data && !isLoading) {
//       form.reset({
//         ...data,
//         phone: data.phone ?? undefined,
//         email: data.email ?? undefined,
//         dateRequest: data.dateRequest?.toISOString(),
//         orderStarus: data.orderStatus as StatusOrder,
//         resource: data.resource ?? "",
//         contacts: data?.additionalContacts ?? [],
//       });
//     }
//   }, [form, data, isLoading]);

//   if (isLoading) <FormDealSkeleton />;

//   return (
//     <OrderFormBody
//       form={form}
//       onSubmit={onSubmit}
//       isPending={isPending}
//     />
//   );
// };

// export default EditOrderForm;
