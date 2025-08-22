export type EventInputType = {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
};

export type EventDataType = {
  id?: string;
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
