import { Guid } from 'guid-typescript';

export interface ChatInterface {
  recipientUserId: Guid;
  recipientUsername: string;
  recipientAvatarUrl: string;
}
