import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { Roles } from 'src/app/shared/enums/roles.enum';
import { environment } from 'src/environments/environment';
import { GetArticlesInterface } from '../../all-articles/models/GetArticles.interface';
import { ChangeRoleInterface } from '../models/changeRole.interface';
import { StatisticsInterface } from '../models/statistics.interface';
import { UsersInterface } from '../models/users.interface';
import { VerifyArticleInterface } from '../models/verifyArticle.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  constructor(private readonly http: HttpClient) { }

  getWaitingArticles(): Observable<GetArticlesInterface>{
    const url = environment.apiUrl + 'article/get-list-of-waiting-articles';

    return this.http.get<GetArticlesInterface>(url);
  }

  searchWaitingArticles(partTitle: string): Observable<GetArticlesInterface>{
    const url = environment.apiUrl + 'article/search-waiting-articles-by-title';
    if(partTitle.trim() === ''){
      return this.getWaitingArticles();
    }
    let params = new HttpParams().append('partTitle', partTitle.toString());

    return this.http.get<GetArticlesInterface>(url, {params});
  }

  verifyArticle(data: VerifyArticleInterface) : Observable<void> {
    const url = environment.apiUrl + 'article/verify-article';

    return this.http.put<void>(url, data);
  }

  deleteArticle(id: Guid): Observable<void>{
    const url = environment.apiUrl + 'article/delete-article';
    let params = new HttpParams().append('id', id.toString());

    return this.http.delete<void>(url, {params});
  }

  makeAdmin(data: ChangeRoleInterface) : Observable<void> {
    const url = environment.apiUrl + 'user/change-role-to-admin';

    return this.http.put<void>(url, data);
  }

  getUsers(): Observable<UsersInterface>{
    const url = environment.apiUrl + 'user/get-list-of-user';
    let params = new HttpParams().append('role', Roles.User.toString());

    return this.http.get<UsersInterface>(url, {params});
  }

  getAdmins(): Observable<UsersInterface>{
    const url = environment.apiUrl + 'user/get-list-of-user';
    let params = new HttpParams().append('role', Roles.Admin.toString());

    return this.http.get<UsersInterface>(url, {params});
  }

  searchUsers(partUsername: string): Observable<UsersInterface>{
    const url = environment.apiUrl + 'user/search-users-by-username';
    if(partUsername.trim() === ''){
      return this.getUsers();
    }
    let params = new HttpParams().append('partUsername', partUsername);

    return this.http.get<UsersInterface>(url, {params});
  }

  getStatisctics(): Observable<StatisticsInterface>{
    const url = environment.apiUrl + 'user/get-statistics';

    return this.http.get<StatisticsInterface>(url);
  }
}
