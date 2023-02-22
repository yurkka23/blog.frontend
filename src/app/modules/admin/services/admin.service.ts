import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { map, Observable } from 'rxjs';
import { Roles } from 'src/app/shared/enums/roles.enum';
import { environment } from 'src/environments/environment';
import { ArticleInterface } from '../../all-articles/models/Article.interface';
import { GetArticlesInterface } from '../../all-articles/models/GetArticles.interface';
import { PaginatedResult } from '../../all-articles/models/PaginatedResult';
import { getPaginatedResult } from '../../all-articles/services/pagination-helper.service';
import { ChangeRoleInterface } from '../models/changeRole.interface';
import { StatisticsInterface } from '../models/statistics.interface';
import { UsersInterface } from '../models/users.interface';
import { VerifyArticleInterface } from '../models/verifyArticle.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  constructor(private readonly http: HttpClient) { }

  getWaitingArticles(pageSize: number = 8, pageIndex: number = 0): Observable<PaginatedResult<ArticleInterface[]>>{
    const url = environment.apiUrl + 'article/get-list-of-waiting-articles';

    let params = new HttpParams()
    .append('PageSize', pageSize.toString())
    .append('PageNumber', pageIndex.toString());

    return getPaginatedResult<ArticleInterface[]>(url, params, this.http);
  }

  searchWaitingArticles(partTitle: string, pageSize: number = 8, pageIndex: number = 0): Observable<PaginatedResult<ArticleInterface[]>>{
    const url = environment.apiUrl + 'article/search-waiting-articles-by-title';
    if(partTitle.trim() === ''){
      return this.getWaitingArticles(pageSize, pageIndex);
    }
    let params = new HttpParams().append('PartTitle', partTitle.toString())
    .append('PageSize', pageSize.toString())
    .append('PageNumber', pageIndex.toString());

    return getPaginatedResult<ArticleInterface[]>(url, params, this.http);

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
