import { Guid } from "guid-typescript"

export interface PutArticleInterface{
    article: {
        id: Guid,
        title: string,
        content: string,
        genre: string,
        articleImageUrl: string
    }
} 
