import { Guid } from "guid-typescript";
import { State } from "../enums/state.enum";

export interface GetMyArticleInterface{
    id: Guid,
    title: string,
    content: string,
    averageRating: number,
    createdTime: string,
    genre: string,
    articleImageUrl:string,
    state: State,
} 
