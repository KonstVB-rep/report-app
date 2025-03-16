import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";

// import { Textarea } from "@/components/ui/textarea";
// import { transformObjValueToArr } from "@/shared/lib/helpers/transformObjValueToArr";

// import SelectComponent from "@/shared/ui/SelectComponent";
import { TOAST } from "@/entities/user/ui/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { ProjectFormSchema, ProjectSchema } from "../../model/schema";
// import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
// import CalendarComponent from "@/shared/ui/Calendar";
// import {
//   DeliveryProjectLabels,
//   DirectionProjectLabels,
//   StatusProjectLabels
// } from "../../lib/constants";
import { useGetProjectById } from "../../hooks";
// import PhoneInput from "@/shared/ui/PhoneInput";
import { formatterCurrency } from "@/shared/lib/utils";
// import InputNumber from "@/shared/ui/Inputs/InputNumber";
// import InputEmail from "@/shared/ui/Inputs/InputEmail";
import { updateProject } from "../../api";
import {
  DeliveryProject,
  DirectionProject,
  StatusProject,
} from "@prisma/client";
import ProjectFormBody from "./ProjectFormBody";

const EditProjectForm = ({
  close,
  projectId,
}: {
  close: Dispatch<SetStateAction<"add_project" | "edit_project" | null>>;
  projectId: string;
}) => {
  const { authUser } = useStoreUser();
  const { data } = useGetProjectById(projectId);

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      nameDeal: data?.nameDeal || "",
      nameObject: data?.nameObject || "",
      direction: data?.direction ? String(data.direction) : "",
      deliveryType: data?.deliveryType ? String(data.deliveryType) : "",
      projectStatus: data?.projectStatus ? String(data.projectStatus) : "",
      contact: data?.contact || "",
      phone: data?.phone || "",
      email: data?.email || "",
      additionalContact: data?.additionalContact || "",
      amountCP: data?.amountCP || "0",
      amountPurchase: data?.amountPurchase || "0",
      amountWork: data?.amountWork || "0",
      delta: data?.delta || "0",
      comments: data?.comments || "",
      plannedDateConnection: undefined,
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProjectSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }

      return updateProject({
        ...data,
        id: projectId,
        ...data,
        email: data.email || "",
        phone: data.phone || "",
        additionalContact: data.additionalContact || "",
        userId: authUser.id,
        deliveryType: data.deliveryType as DeliveryProject,
        dateRequest: new Date(),
        projectStatus: data.projectStatus as StatusProject,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(data.plannedDateConnection)
          : null,
        direction: data.direction as DirectionProject,
        amountCP: data.amountCP
          ? parseFloat(
              data.amountCP.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0", // Преобразуем в строку
        amountPurchase: data.amountPurchase
          ? parseFloat(
              data.amountPurchase.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        amountWork: data.amountWork
          ? parseFloat(
              data.amountWork.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        delta: data.delta
          ? parseFloat(
              data.delta.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0", // Преобразуем в строку
      });
    },
    onSuccess: () => {
      close(null);
      queryClient.invalidateQueries({
        queryKey: ["projects", authUser?.id],
        exact: true,
      });
    },
  });

  const onSubmit = (data: ProjectSchema) => {
    TOAST.PROMISE(
      new Promise((resolve, reject) => {
        mutate(data, {
          onSuccess: (data) => {
            resolve(data);
          },
          onError: (error) => {
            reject(error);
          },
        });
      }),
      "Проект обновлен"
    );
  };

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        deliveryType: data.deliveryType as DeliveryProject,
        projectStatus: data.projectStatus as StatusProject,
        direction: data.direction as DirectionProject,
        plannedDateConnection: data.plannedDateConnection?.toISOString(), // Преобразуем Date в строку
        email: data.email ?? undefined, // Преобразуем null в undefined
        amountCP: formatterCurrency.format(parseFloat(data.amountCP)),
        amountPurchase: formatterCurrency.format(
          parseFloat(data.amountPurchase)
        ),
        amountWork: formatterCurrency.format(parseFloat(data.amountWork)),
        delta: formatterCurrency.format(parseFloat(data.delta)),
      });
    }
  }, [form, data]);

  return (
    <ProjectFormBody form={form} onSubmit={onSubmit} isPending={isPending} />
    // <ProjectForm form={form} onSubmit={onSubmit} isPending={isPending} />

    // <Form {...form}>
    //   <form
    //     onSubmit={form.handleSubmit(onSubmit)}
    //     className="grid gap-10 max-h-[85vh] overflow-y-auto"
    //   >
    //     <div className="uppercase font-semibold text-center">
    //       Форма редактирования проекта
    //     </div>
    //     <div className="grid sm:grid-cols-2 gap-2 p-1">
    //       <div className="flex flex-col gap-2">
    //         <FormField
    //           control={form.control}
    //           name="nameObject"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Название объекта</FormLabel>
    //               <FormControl>
    //                 <Input
    //                   placeholder="Название объекта/Контрагент"
    //                   required
    //                   {...field}
    //                 />
    //               </FormControl>
    //               {form.formState.errors.nameObject?.message && (
    //                 <FormMessage className="text-red-500">
    //                   form.formState.errors.nameObject?.message
    //                 </FormMessage>
    //               )}
    //             </FormItem>
    //           )}
    //         />
    //         <FormField
    //           control={form.control}
    //           name="direction"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Направление</FormLabel>
    //               <FormControl>
    //                 <SelectComponent
    //                   {...field}
    //                   placeholder="Выберите направление"
    //                   options={transformObjValueToArr(DirectionProjectLabels)}
    //                   onValueChange={(selected) =>
    //                     form.setValue("direction", selected)
    //                   }
    //                   value={field.value}
    //                 />
    //               </FormControl>
    //               {form.formState.errors.direction?.message && (
    //                 <FormMessage className="text-red-500">
    //                   form.formState.errors.direction?.message
    //                 </FormMessage>
    //               )}
    //             </FormItem>
    //           )}
    //         />
    //         <FormField
    //           control={form.control}
    //           name="deliveryType"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Тип поставки</FormLabel>
    //               <FormControl>
    //                 <SelectComponent
    //                   {...field}
    //                   placeholder="Выберите тип поставки"
    //                   options={transformObjValueToArr(DeliveryProjectLabels)}
    //                   onValueChange={(selected) =>
    //                     form.setValue("deliveryType", selected)
    //                   }
    //                   value={field.value}
    //                 />
    //               </FormControl>
    //               {form.formState.errors.deliveryType?.message && (
    //                 <FormMessage className="text-red-500">
    //                   {form.formState.errors.deliveryType?.message}
    //                 </FormMessage>
    //               )}
    //             </FormItem>
    //           )}
    //         />
    //         <FormField
    //           control={form.control}
    //           name="equipmentType"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Тип оборудования</FormLabel>
    //               <FormControl>
    //                 <Input placeholder="Наименование" {...field} />
    //               </FormControl>
    //               {form.formState.errors.equipmentType?.message && (
    //                 <FormMessage className="text-red-500">
    //                   {form.formState.errors.equipmentType?.message}
    //                 </FormMessage>
    //               )}
    //             </FormItem>
    //           )}
    //         />
    //         <FormField
    //           control={form.control}
    //           name="contact"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Контакты</FormLabel>
    //               <FormControl>
    //                 <Input placeholder="Имя контакта" required {...field} />
    //               </FormControl>
    //               {form.formState.errors.contact?.message && (
    //                 <FormMessage className="text-red-500">
    //                   {form.formState.errors.contact?.message}
    //                 </FormMessage>
    //               )}
    //             </FormItem>
    //           )}
    //         />
    //         <FormField
    //           control={form.control}
    //           name="phone"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Телефон</FormLabel>
    //               <FormControl>
    //                 <PhoneInput
    //                   placeholder="Введите телефон пользователя"
    //                   onAccept={field.onChange}
    //                   required={true}
    //                   {...field}
    //                 />
    //               </FormControl>
    //               {form.formState.errors.phone?.message && (
    //                 <FormMessage className="text-red-500">
    //                   {form.formState.errors.phone?.message}
    //                 </FormMessage>
    //               )}
    //             </FormItem>
    //           )}
    //         />
    //         <FormField
    //           control={form.control}
    //           name="email"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Email</FormLabel>
    //               <FormControl>
    //                 <InputEmail {...field} />
    //               </FormControl>
    //               {form.formState.errors.email?.message && (
    //                 <FormMessage className="text-red-500">
    //                   {form.formState.errors.email?.message}
    //                 </FormMessage>
    //               )}
    //             </FormItem>
    //           )}
    //         />
    //       </div>
    //       <div className="flex flex-col gap-2">
    //         <FormField
    //           control={form.control}
    //           name="amountCP"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Сумма КП</FormLabel>
    //               <FormControl>
    //                 <InputNumber
    //                   placeholder="Дельта"
    //                   {...field}
    //                   value={String(field.value || "")}
    //                 />
    //               </FormControl>
    //               {form.formState.errors.amountCP?.message && (
    //                 <FormMessage className="text-red-500">
    //                   {form.formState.errors.amountCP?.message}
    //                 </FormMessage>
    //               )}
    //             </FormItem>
    //           )}
    //         />
    //         <FormField
    //           control={form.control}
    //           name="delta"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Дельта</FormLabel>
    //               <FormControl>
    //                 <InputNumber
    //                   placeholder="Дельта"
    //                   {...field}
    //                   value={String(field.value || "")}
    //                 />
    //               </FormControl>
    //               {form.formState.errors.delta?.message && (
    //                 <FormMessage className="text-red-500">
    //                   {form.formState.errors.delta?.message}
    //                 </FormMessage>
    //               )}
    //             </FormItem>
    //           )}
    //         />
    //         <FormField
    //           control={form.control}
    //           name="projectStatus"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Статус КП</FormLabel>
    //               <FormControl>
    //                 <SelectComponent
    //                   {...field}
    //                   placeholder="Выберите статус КП"
    //                   options={transformObjValueToArr(StatusProjectLabels)}
    //                   onValueChange={(selected) =>
    //                     form.setValue("projectStatus", selected)
    //                   }
    //                   required
    //                   value={field.value}
    //                 />
    //               </FormControl>
    //               {form.formState.errors.projectStatus?.message && (
    //                 <FormMessage className="text-red-500">
    //                   {form.formState.errors.projectStatus?.message}
    //                 </FormMessage>
    //               )}
    //             </FormItem>
    //           )}
    //         />
    //         <FormField
    //           control={form.control}
    //           name="plannedDateConnection"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel className="h-[19px]">
    //                 Планируемый контакт
    //               </FormLabel>
    //               <CalendarComponent field={field} />
    //               {form.formState.errors.plannedDateConnection?.message && (
    //                 <FormMessage className="text-red-500">
    //                   {form.formState.errors.plannedDateConnection?.message}
    //                 </FormMessage>
    //               )}
    //             </FormItem>
    //           )}
    //         />
    //         <FormField
    //           control={form.control}
    //           name="comments"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Примечание / Комментарии</FormLabel>
    //               <FormControl>
    //                 <Textarea
    //                   placeholder="Введите комментарии"
    //                   required
    //                   {...field}
    //                 />
    //               </FormControl>
    //               {form.formState.errors.comments?.message && (
    //                 <FormMessage className="text-red-500">
    //                   {form.formState.errors.comments?.message}
    //                 </FormMessage>
    //               )}
    //             </FormItem>
    //           )}
    //         />
    //       </div>
    //     </div>
    //     <SubmitFormButton
    //       title="Сохранить"
    //       isPending={isPending}
    //       className="w-max ml-auto"
    //     />
    //   </form>
    // </Form>
  );
};

export default EditProjectForm;
