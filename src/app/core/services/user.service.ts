import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateUserInterface } from 'src/app/modules/my-acount/models/updateUser.interface';
import { CurrentUserInterface } from 'src/app/shared/models/currentUser.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly http: HttpClient) { }

  getCurentUserInfo(): Observable<CurrentUserInterface>{
    const url = environment.apiUrl + 'user/get-my-info';
    return this.http.get<CurrentUserInterface>(url);
  }

  updateCurrentUserInfo(data: UpdateUserInterface): Observable<void>{
    const url = environment.apiUrl + 'user/edit-user-info';
    return this.http.put<void>(url, data);
  }
}
