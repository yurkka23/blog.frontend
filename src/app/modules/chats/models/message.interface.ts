import { Guid } from 'guid-typescript';

export interface MessageInterface {
  id: Guid;
  senderId: Guid;
  recipienId: Guid;
  senderUsername: string;
  recipienUsername: string;
  senderPhotoUrl: string;
  recipientPhotoUrl: string;
  content: string;
  dateRead: Date | null;
  messageSent: Date;
}
