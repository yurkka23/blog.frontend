import { Guid } from "guid-typescript";

export interface ArticleInterface{
    id: Guid,
    title: string,
    content: string,
    averageRating: number,
    createdTime: string,
    createdBy: Guid,
    genre: string,
    authorFullName: string,
    articleImageUrl: string
}