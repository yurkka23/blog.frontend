import { Guid } from "guid-typescript";

export interface MyRatingInterface {
    id: number,
    score: number,
    articleTitle: string,
    articleImage: string,
    articleId: Guid
  }