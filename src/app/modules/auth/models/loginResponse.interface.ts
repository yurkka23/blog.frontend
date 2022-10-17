import { CurrentUserInterface } from "src/app/shared/models/currentUser.interface";

export interface LoginResponseInterface{
    jwtToken: string,
    refreshToken: string,
    user: CurrentUserInterface
} 