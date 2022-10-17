import { Guid } from "guid-typescript";
import { State } from "../../my-articles/enums/state.enum";

export interface VerifyArticleInterface{
    id: Guid,
    state: State
} 