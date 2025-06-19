"use client";

import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

// import { ArrowLeft } from "lucide-react";

// import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { transformObjValueToArr } from "@/shared/lib/helpers/transformObjValueToArr";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import DatePickerFormField from "@/shared/ui/Inputs/DatePickerFormField";
import InputPhoneForm from "@/shared/ui/Inputs/InputPhoneForm";
import InputTextForm from "@/shared/ui/Inputs/InputTextForm";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/ui/Overlay";
import SelectFormField from "@/shared/ui/SelectForm/SelectFormField";

import { getManagers } from "@/entities/department/lib/utils";


type OrderFormBodyProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;

};

const setSelectValue = <T extends FieldValues>(
  form: UseFormReturn<T>,
  name: keyof T,
  selected: unknown
) => {
  if (selected) {
    form.setValue(name as Path<T>, selected as PathValue<T, Path<T>>);
  }
};

const managers = getManagers();

const OrderFormBody = <T extends FieldValues>({
  form,
  onSubmit,
  isPending,

}: OrderFormBodyProps<T>) => {

  const handleSubmit = (data: T) => {
    onSubmit(data);
  };


  const error = (name: keyof T) =>
    form.formState.errors[name]?.message as string;

  return (
    <MotionDivY className="max-h-[82vh] overflow-y-auto flex gap-1 overflow-x-hidden">
      <Overlay isPending={isPending} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid max-h-[82vh] min-w-full gap-5 overflow-y-auto"
        >
          <div className="text-center font-semibold uppercase">
            Форма добавления заявки
          </div>
          <div className="grid gap-2 p-2 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <DatePickerFormField
                name={"dateRequest" as Path<T>}
                label="Дата запроса"
                control={form.control}
                errorMessage={error("dateRequest")}
              />

              <InputTextForm
                name={"nameDeal" as Path<T>}
                label="Название сделки"
                control={form.control}
                errorMessage={error("nameDeal")}
                required
                placeholder="Название..."
              />


              <InputTextForm
                name={"contact" as Path<T>}
                label="Контакты"
                control={form.control}
                errorMessage={error("contact")}
                required
                placeholder="Имя контакта"
              />

              <InputPhoneForm
                name={"phone" as Path<T>}
                label="Телефон"
                control={form.control}
                errorMessage={error("phone")}
                placeholder="Введите телефон пользователя"
              />
            </div>

            <div className="flex flex-col gap-1">
              <InputTextForm
                name={"email" as Path<T>}
                label="Email"
                type="email"
                control={form.control}
                errorMessage={error("email")}
                className="w-full invalid:[&:not(:placeholder-shown)]:border-red-500"
              />

              <InputTextForm
                name={"resource" as Path<T>}
                label="Источник"
                control={form.control}
                errorMessage={error("resource")}
                required
                placeholder="Откуда пришёл клиент"
              />

              <FormField
                control={form.control}
                name={"comments" as Path<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Примечание / Комментарии</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Введите комментарии"
                        required
                        {...field}
                      />
                    </FormControl>
                    {error("comments") && (
                      <FormMessage className="text-red-500">
                        {error("comments")}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />


               <SelectFormField
                name={"manager" as Path<T>}
                label="Менеджер"
                control={form.control}
                errorMessage={error("manager")}
                options={transformObjValueToArr(managers)}
                placeholder="Выберите исполнителя"
                onValueChange={(selected) =>{
                  return setSelectValue(form, "manager", selected)
                }}
                className="capitalize"
                required
              /> 

            </div>
          </div>

          

          <div className="flex items-center justify-between flex-wrap gap-2">
            <SubmitFormButton
              title="Сохранить"
              isPending={isPending}
              className="ml-auto mr-2 w-max"
            />
          </div>
        </form>

      </Form>
    </MotionDivY>
  );
};

export default OrderFormBody;
