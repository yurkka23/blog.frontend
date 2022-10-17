import { Guid } from "guid-typescript"

export interface AuthResponseInterface{
    id: Guid
    username: string
    firstName: string
    lastName: string
    aboutMe: string | null
    token: string
} 