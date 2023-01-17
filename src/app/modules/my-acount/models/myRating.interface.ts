import { Guid } from 'guid-typescript';

export interface MyRatingInterface {
  id: Guid;
  score: number;
  articleTitle: string;
  articleImage: string;
  articleId: Guid;
}
