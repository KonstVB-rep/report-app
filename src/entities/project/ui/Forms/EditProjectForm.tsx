import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { transformObjValueToArr } from "@/shared/lib/helpers/transformObjValueToArr";
import { Delivery, Direction, Status } from "@prisma/client";
import SelectComponent from "@/shared/ui/SelectComponent";
import { TOAST } from "@/entities/user/ui/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../../api";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { ProjectFormSchema, ProjectSchema } from "../../model/schema";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import CalendarComponent from "@/shared/ui/Calendar";
import {
  DeliveryLabels,
  DirectionLabels,
  StatusLabels,
} from "../../lib/constants";
import { useGetProjectById } from "../../hooks";
import PhoneInput from "@/shared/ui/PhoneInput";
import { formatterCurrency } from "@/shared/lib/utils";
import InputNumber from "@/shared/ui/Inputs/InputNumber";
import InputEmail from "@/shared/ui/Inputs/InputEmail";

const EditProjectForm = ({
  close,
  projectId,
}: {
  close: Dispatch<SetStateAction<"add_project" | "edit_project" | null>>;
  projectId: string;
}) => {
  const { authUser } = useStoreUser();
  const { data: project } = useGetProjectById(projectId);

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      nameObject: project?.nameObject || "",
      equipment_type: project?.equipment_type || "",
      direction: project?.direction ? String(project.direction) : "",
      deliveryType: project?.deliveryType ? String(project.deliveryType) : "",
      project_status: project?.project_status
        ? String(project.project_status)
        : "",
      contact: project?.contact || "",
      phone: project?.phone || "",
      email: project?.email || "",
      amountCo: project?.amountCo || "0",
      delta: project?.delta || "0",
      comments: project?.comments || "",
      lastDateConnection: project?.lastDateConnection.toString() || undefined,
      plannedDateConnection:
        project?.plannedDateConnection.toString() || undefined,
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
        email: data.email || "",
        dateRequest: new Date(),
        deliveryType: data.deliveryType as Delivery,
        project_status: data.project_status as Status,
        lastDateConnection: new Date(data.lastDateConnection),
        plannedDateConnection: new Date(data.plannedDateConnection),
        direction: data.direction as Direction,
        userId: authUser.id,
        amountCo: data.amountCo
          ? parseFloat(data.amountCo.replace(/\s/g, "").replace(",", "."))
          : 0,
        delta: data.delta
          ? parseFloat(data.delta.replace(/\s/g, "").replace(",", "."))
          : 0,
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
    if (project) {
      form.reset({
        ...project,
        deliveryType: project.deliveryType as Delivery,
        project_status: project.project_status as Status,
        direction: project.direction as Direction,
        lastDateConnection: project.lastDateConnection?.toISOString(), // Преобразуем Date в строку
        plannedDateConnection: project.plannedDateConnection?.toISOString(), // Преобразуем Date в строку
        email: project.email ?? undefined, // Преобразуем null в undefined
        amountCo: formatterCurrency.format(parseFloat(project.amountCo)),
        delta: formatterCurrency.format(parseFloat(project.delta)),
      });
    }
  }, [form, project]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-10 max-h-[85vh] overflow-y-auto"
      >
        <div className="uppercase font-semibold text-center">
          Форма редактирования проекта
        </div>
        <div className="grid sm:grid-cols-2 gap-2 p-1">
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="nameObject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название объекта</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Название объекта/Контрагент"
                      required
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.nameObject?.message && (
                    <FormMessage>
                      form.formState.errors.nameObject?.message
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Направление</FormLabel>
                  <FormControl>
                    <SelectComponent
                      {...field}
                      placeholder="Выберите направление"
                      options={transformObjValueToArr(DirectionLabels)}
                      onValueChange={(selected) =>
                        form.setValue("direction", selected)
                      }
                      value={field.value}
                    />
                  </FormControl>
                  {form.formState.errors.direction?.message && (
                    <FormMessage>
                      form.formState.errors.direction?.message
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип поставки</FormLabel>
                  <FormControl>
                    <SelectComponent
                      {...field}
                      placeholder="Выберите тип поставки"
                      options={transformObjValueToArr(DeliveryLabels)}
                      onValueChange={(selected) =>
                        form.setValue("deliveryType", selected)
                      }
                      value={field.value}
                    />
                  </FormControl>
                  {form.formState.errors.deliveryType?.message && (
                    <FormMessage>
                      {form.formState.errors.deliveryType?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equipment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип оборудования</FormLabel>
                  <FormControl>
                    <Input placeholder="Наименование" required {...field} />
                  </FormControl>
                  {form.formState.errors.equipment_type?.message && (
                    <FormMessage>
                      {form.formState.errors.equipment_type?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Контакты</FormLabel>
                  <FormControl>
                    <Input placeholder="Имя контакта" required {...field} />
                  </FormControl>
                  {form.formState.errors.contact?.message && (
                    <FormMessage>
                      {form.formState.errors.contact?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder="Введите телефон пользователя"
                      onAccept={field.onChange}
                      required={true}
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.phone?.message && (
                    <FormMessage>
                      {form.formState.errors.phone?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <InputEmail {...field} />
                  </FormControl>
                  {form.formState.errors.email?.message && (
                    <FormMessage>
                      {form.formState.errors.email?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="amountCo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сумма КП</FormLabel>
                  <FormControl>
                    <InputNumber
                      placeholder="Дельта"
                      {...field}
                      value={String(field.value || "")}
                    />
                  </FormControl>
                  {form.formState.errors.amountCo?.message && (
                    <FormMessage>
                      {form.formState.errors.amountCo?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="delta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дельта</FormLabel>
                  <FormControl>
                    <InputNumber
                      placeholder="Дельта"
                      {...field}
                      value={String(field.value || "")}
                    />
                  </FormControl>
                  {form.formState.errors.delta?.message && (
                    <FormMessage>
                      {form.formState.errors.delta?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="project_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус КП</FormLabel>
                  <FormControl>
                    <SelectComponent
                      {...field}
                      placeholder="Выберите статус КП"
                      options={transformObjValueToArr(StatusLabels)}
                      onValueChange={(selected) =>
                        form.setValue("project_status", selected)
                      }
                      required
                      value={field.value}
                    />
                  </FormControl>
                  {form.formState.errors.project_status?.message && (
                    <FormMessage>
                      {form.formState.errors.project_status?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastDateConnection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="h-[19px]">Последний контакт</FormLabel>
                  <CalendarComponent field={field} required={true} />
                  {form.formState.errors.lastDateConnection?.message && (
                    <FormMessage>
                      {form.formState.errors.lastDateConnection?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plannedDateConnection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="h-[19px]">
                    Планируемый контакт
                  </FormLabel>
                  <CalendarComponent field={field} required={true} />
                  {form.formState.errors.plannedDateConnection?.message && (
                    <FormMessage>
                      {form.formState.errors.plannedDateConnection?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comments"
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
                  {form.formState.errors.comments?.message && (
                    <FormMessage>
                      {form.formState.errors.comments?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>
        </div>
        <SubmitFormButton
          title="Сохранить"
          isPending={isPending}
          className="w-max ml-auto"
        />
      </form>
    </Form>
  );
};

export default EditProjectForm;
