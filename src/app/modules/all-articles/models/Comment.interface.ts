import { Guid } from 'guid-typescript';

export interface CommentInterface {
  id: Guid;
  message: string;
  authorUserName: string;
  authorImgUrl: string;
}
