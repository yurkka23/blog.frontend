import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsersInterface } from '../../admin/models/users.interface';
import { CreateSubscriptionDTO } from '../models/CreateSubscriptionDTO.interface';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  constructor(private readonly http: HttpClient) {}

  getFollowingsById(id: Guid): Observable<UsersInterface> {
    const url = environment.apiUrl + 'subscription/user-subscribed-to';
    let params = new HttpParams().append('userId', id.toString());

    return this.http.get<UsersInterface>(url, { params });
  }

  getFollowersById(id: Guid): Observable<UsersInterface> {
    const url = environment.apiUrl + 'subscription/user-subscriptions';
    let params = new HttpParams().append('userId', id.toString());

    return this.http.get<UsersInterface>(url, { params });
  }

  follow(data: CreateSubscriptionDTO): Observable<void> {
    const url = environment.apiUrl + 'subscription/create-subscription';

    return this.http.post<void>(url, data);
  }

  unfollow(userToSubscribeId: Guid): Observable<void> {
    const url = environment.apiUrl + 'subscription/delete-subscription';
    let params = new HttpParams().append(
      'userToSubscribeId',
      userToSubscribeId.toString()
    );

    return this.http.delete<void>(url, { params });
  }
}
