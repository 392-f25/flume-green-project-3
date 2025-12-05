export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  eventId?: string | null;
  eventName?: string | null;
  read: boolean;
  createdAt?: Date;
}


