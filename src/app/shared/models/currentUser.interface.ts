import {Guid} from 'guid-typescript';
import { Roles } from '../enums/roles.enum';

export interface CurrentUserInterface {
    id: Guid
    userName: string
    firstName: string
    lastName: string
    aboutMe: string | null
    role: Roles
    imageUserUrl: string
  }
