import { Injectable } from '@angular/core';
import { CurrentUserInterface } from '../models/currentUser.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setUser(data: CurrentUserInterface): void{
    try{
      localStorage.setItem("user", JSON.stringify(data));
    }
    catch(e)
    {
      console.error('Error saving user to localStorage', e);
    }
  }
  getUser(): CurrentUserInterface | null{
    try{
      const user : string | null = localStorage.getItem("user");
      return user ?  JSON.parse(user) as CurrentUserInterface : null;
    }
    catch(e)
    {
      console.error('Error getting user from localStorage', e);
      return null;
    }
  }

  setJwtToken(data:string): void{
    try{
      localStorage.setItem("jwtToken", JSON.stringify(data));
    }
    catch(e)
    {
      console.error('Error saving jwtToken to localStorage', e);
    }
  }

  setRefreshToken(data:string): void{
    try{
      localStorage.setItem("refreshToken", JSON.stringify(data));
    }
    catch(e)
    {
      console.error('Error saving refreshToken to localStorage', e);
    }
  }

  getJwtToken(): string | null{
    try{
      const jwtToken = localStorage.getItem("jwtToken");
      if(jwtToken){
        return JSON.parse(jwtToken);
      }
      return null;
    }
    catch(e)
    {
      console.error('Error getting jwtToken from localStorage', e);
      return null;
    }
  }
  getRefreshToken(): string | null{
    try{
      const refreshToken = localStorage.getItem("refreshToken");
      if(refreshToken){
        return JSON.parse(refreshToken);
      }
      return null;
    }
    catch(e)
    {
      console.error('Error getting refreshToken from localStorage', e);
      return null;
    }
  }

  clearAllData(): void{
    try{
      localStorage.clear();
    }
    catch(e)
    {
      console.error('Error clear localStorage', e);
    }
  }
}
