export type EventInputType = {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
};


export type EventDataType = {
  id?:string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
};

export type EventResponse = {
  userId: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  notified: boolean;
};

export type ChatType = { chatName: string; isActive: boolean };

export type ChatBotType = {
  chatName: string;
  userId: string;
  isActive: boolean;
};

export type ResponseChatBotType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isActive: boolean;
  botId: string;
  chatId: string;
  telegramUserId: string;
  chatName: string;
  telegramUsername: string | null;
};
