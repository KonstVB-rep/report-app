"use client";
import React, { Dispatch, SetStateAction } from "react";
import ProjectForm from "./ProjectForm";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RetailForm from "./RetailForm";

const NewDealForm = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {


  return (
    <>
      <h2 className="uppercase font-semibold text-center">
        Форма добавления новой сделки
      </h2>
      <Tabs defaultValue="project">
        <TabsList className="grid w-full grid-cols-2 mt-3 mb-6">
          <TabsTrigger value="project">Проект</TabsTrigger>
          <TabsTrigger value="retail">Розница</TabsTrigger>
        </TabsList>
        <TabsContent value="project">
          <ProjectForm />
        </TabsContent>
        <TabsContent value="retail">
          <RetailForm setOpen={setOpen} />
        </TabsContent>
      </Tabs>
    </>

    // <Form {...form}>
    //   <form
    //     onSubmit={form.handleSubmit(onSubmit)}
    //     className="grid gap-10 max-h-[85vh] overflow-y-auto"
    //   >
    //     <div className="uppercase font-semibold text-center">
    //       Форма добавления нового проекта
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
    //                   {form.formState.errors.nameObject?.message}
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
    //                   placeholder="Выберите направление"
    //                   options={transformObjValueToArr(DirectionProjectLabels)}
    //                   onValueChange={(selected) =>
    //                     form.setValue("direction", selected)
    //                   }
    //                   required
    //                   {...field}
    //                 />
    //               </FormControl>
    //               {form.formState.errors.direction?.message && (
    //                 <FormMessage className="text-red-500">
    //                   {form.formState.errors.direction?.message}
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
    //                   placeholder="Выберите тип поставки"
    //                   options={transformObjValueToArr(DeliveryProjectLabels)}
    //                   onValueChange={(selected) =>
    //                     form.setValue("deliveryType", selected)
    //                   }
    //                   {...field}
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
    //           name="contact"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Контакты</FormLabel>
    //               <FormControl>
    //                 <Input placeholder="Имя контакта" required {...field} />
    //               </FormControl>
    //               {form.formState.errors.contact?.message && (
    //                 <FormMessage className="text-red-500">
    //                   form.formState.errors.contact?.message
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
    //                   placeholder="Сумма КП"
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
    //                   placeholder="Выберите статус КП"
    //                   options={transformObjValueToArr(StatusProjectLabels)}
    //                   onValueChange={(selected) =>
    //                     form.setValue("projectStatus", selected)
    //                   }
    //                   required
    //                   {...field}
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

export default NewDealForm;
