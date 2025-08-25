import handleMutationWithAuthCheck from "@/shared/api/handleMutationWithAuthCheck";
import { logout } from "@/shared/auth/logout";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { useFormSubmission } from "@/shared/hooks/useFormSubmission";
import { useMutation } from "@tanstack/react-query";
// import { ChatBotType, ResponseChatBotType } from "../type";
// import { toggleSubscribeChatBot } from "../api";
import { ChatFormData, saveChat } from "@/app/adminboard/actions/user-chat";
import { ActionResponse } from "@/shared/types";
import { deleteChat } from "../api";
import { usePathname } from "next/navigation";
import { UserTelegramChat } from "@prisma/client";

export const useCreateChatBot = (onSetState: (data: ActionResponse<ChatFormData>) => void) => {
  const { authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async (chatData: FormData) => {
 
      return handleMutationWithAuthCheck<FormData, ActionResponse<ChatFormData>>(
        saveChat,
        chatData,
        authUser,
        isSubmittingRef
      );
    },
    onSuccess: (data) => {
      if (!data) {
        return;
      }
    if(!data.success) {
    onSetState(data);
    TOAST.ERROR(data.message);
    return;
    }
    onSetState(data);
    TOAST.SUCCESS(data.message);
    //   queryClient.invalidateQueries({
    //     queryKey: ["chatInfo", authUser?.id, data.result.chatName],
    //   });
    //   queryClient.invalidateQueries({
    //     queryKey: ["chatInfoChecked", authUser?.id, data.result.chatName],
    //   });
    },
    onError: (error, variables, context) => {
      const err = error as Error & { status?: number };
      console.log(error, variables, context, 'useCreateChatBot');

      if (err.status === 401 || err.message === "Сессия истекла") {
        TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
        logout();
        return;
      }

      const errorMessage =
        err.message === "Failed to fetch"
          ? "Ошибка соединения"
          : "Ошибка при подписке на чат бот";

      TOAST.ERROR(errorMessage);
    },
  });
};

export const useDeleteChat = () => {
  const { authUser, isSubmittingRef } = useFormSubmission();
   const pathName = usePathname();

  return useMutation({
    mutationFn: async (chatId:string ) => {
 
      return handleMutationWithAuthCheck<{ chatId: string; pathName: string }, UserTelegramChat>(
        deleteChat,
        { chatId, pathName },
        authUser,
        isSubmittingRef
      );
    },
    onSuccess: (data) => {

    TOAST.SUCCESS(`Чат ${data.chatName} успешно удален`);
    },
    onError: (error, variables, context) => {
      const err = error as Error & { status?: number };
      console.log(error, variables, context, 'useCreateChatBot');

      if (err.status === 401 || err.message === "Сессия истекла") {
        TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
        logout();
        return;
      }

      const errorMessage =
        err.message === "Failed to fetch"
          ? "Ошибка соединения"
          : "Ошибка при подписке на чат бот";

      TOAST.ERROR(errorMessage);
    },
  });
}

// export const useUpdateChatBot = () => {
//   const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

//   return useMutation({
//     mutationFn: async (chatData: {
//       botId: string | null;
//       chatId: string;
//       isActive: boolean;
//     }) => {
//       if (!chatData.botId) return;

//       const data = {
//         chatName: chatData.botId,
//         chatId: chatData.chatId,
//         isActive: chatData.isActive,
//       };
//       return handleMutationWithAuthCheck<ChatBotType, ResponseChatBotType>(
//         toggleSubscribeChatBot,
//         data,
//         authUser,
//         isSubmittingRef
//       );
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: ["chatInfo", authUser?.id, data?.chatName],
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["chatInfoChecked", authUser?.id, data?.chatName],
//       });
//     },
//     onError: (error) => {
//       const err = error as Error & { status?: number };

//       if (err.status === 401 || err.message === "Сессия истекла") {
//         TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
//         logout();
//         return;
//       }

//       const errorMessage =
//         err.message === "Failed to fetch"
//           ? "Ошибка соединения"
//           : "Ошибка при обновлении статуса бота";

//       TOAST.ERROR(errorMessage);
//     },
//   });
// };


// export const useCreateChatBot = () => {
//   const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

//   return useMutation({
//     mutationFn: async (chatData: ChatBotType) => {
//       const data = {
//         chatName: chatData.chatName,
//         chatId: chatData.chatId,
//         isActive: chatData.isActive,
//       };

//       return handleMutationWithAuthCheck<ChatBotType, ResponseChatBotType>(
//         toggleSubscribeChatBot,
//         data,
//         authUser,
//         isSubmittingRef
//       );
//     },
//     onSuccess: (data) => {
//       if (!data) {
//         return;
//       }
//       queryClient.invalidateQueries({
//         queryKey: ["chatInfo", authUser?.id, data.chatName],
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["chatInfoChecked", authUser?.id, data.chatName],
//       });
//     },
//     onError: (error) => {
//       const err = error as Error & { status?: number };

//       if (err.status === 401 || err.message === "Сессия истекла") {
//         TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
//         logout();
//         return;
//       }

//       const errorMessage =
//         err.message === "Failed to fetch"
//           ? "Ошибка соединения"
//           : "Ошибка при подписке на чат бот";

//       TOAST.ERROR(errorMessage);
//     },
//   });
// };

// export const useUpdateChatBot = () => {
//   const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

//   return useMutation({
//     mutationFn: async (chatData: {
//       botId: string | null;
//       chatId: string;
//       isActive: boolean;
//     }) => {
//       if (!chatData.botId) return;

//       const data = {
//         chatName: chatData.botId,
//         chatId: chatData.chatId,
//         isActive: chatData.isActive,
//       };
//       return handleMutationWithAuthCheck<ChatBotType, ResponseChatBotType>(
//         toggleSubscribeChatBot,
//         data,
//         authUser,
//         isSubmittingRef
//       );
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: ["chatInfo", authUser?.id, data?.chatName],
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["chatInfoChecked", authUser?.id, data?.chatName],
//       });
//     },
//     onError: (error) => {
//       const err = error as Error & { status?: number };

//       if (err.status === 401 || err.message === "Сессия истекла") {
//         TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
//         logout();
//         return;
//       }

//       const errorMessage =
//         err.message === "Failed to fetch"
//           ? "Ошибка соединения"
//           : "Ошибка при обновлении статуса бота";

//       TOAST.ERROR(errorMessage);
//     },
//   });
// };
