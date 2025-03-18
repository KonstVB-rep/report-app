// "use client";
// import React, { Dispatch, SetStateAction } from "react";
// import { useForm, FormProvider } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { TOAST } from "@/entities/user/ui/Toast";
// import {
//   ProjectFormSchema,
//   ProjectSchema,
//   RetailFormSchema,
//   RetailSchema,
// } from "../../model/schema";
// import { createProject } from "../../api";
// import useStoreUser from "@/entities/user/store/useStoreUser";
// import {
//   DeliveryProject,
//   DirectionProject,
//   StatusProject,
// } from "@prisma/client";
// import ProjectForm from "./ProjectForm";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import RetailForm from "./RetailForm";

// const NewDealForm = ({
//   setOpen,
// }: {
//   setOpen: Dispatch<SetStateAction<boolean>>;
// }) => {
//   const queryClient = useQueryClient();
//   const { authUser } = useStoreUser();

//   // Мутация для создания проекта
//   const {
//     mutate: mutateProject,
//     isPending: isPendingProject,
//     isError: isErrorProject,
//     error: errorProject,
//   } = useMutation({
//     mutationKey: ["createProject"], // Добавлено название мутации
//     mutationFn: (data: ProjectSchema) => {
//       if (!authUser?.id) {
//         throw new Error("User ID is missing");
//       }

//       return createProject({
//         ...data,
//         email: data.email || "",
//         phone: data.phone || "",
//         additionalContact: data.additionalСontact || "",
//         userId: authUser.id,
//         deliveryType: data.deliveryType as DeliveryProject,
//         dateRequest: new Date(),
//         projectStatus: data.projectStatus as StatusProject,
//         plannedDateConnection: data.plannedDateConnection
//           ? new Date(data.plannedDateConnection)
//           : null,
//         direction: data.direction as DirectionProject,
//         amountCP: data.amountCP
//           ? parseFloat(data.amountCP.replace(/\s/g, "").replace(",", "."))
//               .toString()
//           : "0",
//         amountPurchase: data.amountPurchase
//           ? parseFloat(data.amountPurchase.replace(/\s/g, "").replace(",", "."))
//               .toString()
//           : "0",
//         amountWork: data.amountWork
//           ? parseFloat(data.amountWork.replace(/\s/g, "").replace(",", "."))
//               .toString()
//           : "0",
//         delta: data.delta
//           ? parseFloat(data.delta.replace(/\s/g, "").replace(",", "."))
//               .toString()
//           : "0",
//       });
//     },
//     onError: (error) => {
//       // Обработка ошибок
//       console.error("Ошибка при создании проекта:", error);
//       TOAST.ERROR("Ошибка при создании проекта");
//     },
//     onSuccess: (data) => {
//       if (data) {
//         setOpen(false);
//         queryClient.invalidateQueries({
//           queryKey: ["projects", authUser?.id],
//           exact: true,
//         });
//         queryClient.invalidateQueries({
//           queryKey: ["all-projects", authUser?.departmentId],
//         });
//       }
//     },
//   });

//   // Форма для вкладки "Проект"
//   const formProject = useForm<ProjectSchema>({
//     resolver: zodResolver(ProjectFormSchema),
//     defaultValues: {
//       nameDeal: "",
//       nameObject: "",
//       direction: "",
//       deliveryType: "",
//       contact: "",
//       phone: "",
//       email: "",
//       additionalСontact: "",
//       amountCP: "",
//       amountWork: "",
//       amountPurchase: "",
//       delta: "",
//       projectStatus: "",
//       comments: "",
//       plannedDateConnection: undefined,
//     },
//   });

//   // Форма для вкладки "Розница"
//   const formRetail = useForm<RetailSchema>({
//     resolver: zodResolver(RetailFormSchema),
//     defaultValues: {
//       nameDeal: "",
//       nameObject: "",
//       direction: "",
//       deliveryType: "",
//       contact: "",
//       phone: "",
//       email: "",
//       equipmentType: "",
//       amountCP: "",
//       delta: "",
//       projectStatus: "",
//       comments: "",
//       plannedDateConnection: undefined,
//     },
//   });

//   // Обработчик отправки формы "Проект"
//   const onSubmitProject = (data: ProjectSchema) => {
//     TOAST.PROMISE(
//       new Promise((resolve, reject) => {
//         mutateProject(data, {
//           onSuccess: (data) => {
//             resolve(data);
//           },
//           onError: (error) => {
//             reject(error);
//           },
//         });
//       }),
//       "Проект создан"
//     );
//   };

//   // Обработчик отправки формы "Розница" (пока пустой)
//   const onSubmitRetail = (data: RetailSchema) => {
//     console.log(data);
//     TOAST.SUCCESS("Розница создана");
//   };

//   return (
//     <Tabs defaultValue="project" className="w-[400px]">
//       <TabsList className="grid w-full grid-cols-2">
//         <TabsTrigger value="project">Проект</TabsTrigger>
//         <TabsTrigger value="retail">Розница</TabsTrigger>
//       </TabsList>
//       <TabsContent value="project">
//         {/* Оборачиваем ProjectForm в FormProvider */}
//         <FormProvider {...formProject}>
//           <ProjectForm
//             form={formProject}
//             onSubmit={onSubmitProject}
//             isPending={isPendingProject}
//           />
//         </FormProvider>
//       </TabsContent>
//       <TabsContent value="retail">
//         {/* Оборачиваем RetailForm в FormProvider */}
//         <FormProvider {...formRetail}>
//           <RetailForm
//             form={formRetail}
//             onSubmit={onSubmitRetail}
//             isPending={false}
//           />
//         </FormProvider>
//       </TabsContent>
//     </Tabs>
//   );
// };

// export default NewDealForm;

"use client";

import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Plus } from "lucide-react";
import React, { useState } from "react";
import ProjectForm from "../Forms/ProjectForm";


const AddNewProject = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          <span>Добавить проект</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]" showX={true}>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ProjectForm/>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewProject;
