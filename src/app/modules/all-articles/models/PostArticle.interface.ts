import { Guid } from "guid-typescript";
import { State } from "../../my-articles/enums/state.enum";

export interface PostArticleInterface{
    title: string,
    content: string,
    averageRating: number,
    createdTime: string,
    updatedTime: string,
    createdBy: Guid,
    updatedBy: Guid | null,
    genre: string,
    authorFullName: string,
    articleImageUrl: string,
    authorImageUrl: string,
    state: State,
}