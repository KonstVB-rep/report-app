import handleErrorSession from "@/shared/auth/handleErrorSession";
import { useFormSubmission } from "@/shared/hooks/useFormSubmission";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addEquipment,
  addToKit,
  deleteEquipmentList,
  updateEquipmentsList,
} from "../actions/offer.actions";
import type { EquipmentFormValues } from "../components/AddNewEquipmentDialog";
import type { EquipmentDb, EquipmentWithQuantity } from "../lib/types";

export const useAddEquipment = (
  reset: (values: EquipmentFormValues) => void,
) => {
  const { queryClient } = useFormSubmission();
  return useMutation({
    mutationFn: async (item: EquipmentFormValues) => {
      return await addEquipment(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["equipments"],
      });
      reset({
        name: "",
        image: "",
        isKit: false,
        description: "",
        price: "0,00",
      });
    },
    onError: (error: unknown) => {
      handleErrorSession(error);
    },
  });
};

export const useAddItemsToKit = () => {
  const { queryClient } = useFormSubmission();
  return useMutation({
    mutationFn: async (data: {
      kitId: string;
      itemsKit: EquipmentWithQuantity[];
    }) => {
      return await addToKit(data.kitId, data.itemsKit);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["equipments"],
      });
      toast.success("Состав комплекта обновлен");
    },
    onError: (error: unknown) => {
      handleErrorSession(error);
    },
  });
};

export const useDeleteEquipments = () => {
  const { queryClient } = useFormSubmission();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      return await deleteEquipmentList(ids);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },

    onError: (error: unknown) => {
      handleErrorSession(error);
    },
  });
};

export const useUpdateEquipments = () => {
  const { queryClient } = useFormSubmission();
  return useMutation({
    mutationFn: async (items: Partial<EquipmentDb>[]) => {
      return await updateEquipmentsList(items);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
    onError: (error: unknown) => {
      handleErrorSession(error);
    },
  });
};
