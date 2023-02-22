import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../../all-articles/models/PaginatedResult';
import { getPaginatedResult } from '../../all-articles/services/pagination-helper.service';
import { GetMyArticleInterface } from '../models/GetMyArticle.interface';
import { GetMyArticlesInterface } from '../models/GetMyArticles.interface';
import { PostArticleInterface } from '../models/PostArticle.interface';
import { PutArticleInterface } from '../models/PutArticle.interface';

@Injectable({
  providedIn: 'root'
})
export class MyArticlesService {

  constructor(private readonly http: HttpClient) { }

  getMyArticles(pageSize: number = 8, pageIndex: number = 0):  Observable<PaginatedResult<GetMyArticleInterface[]>>{
    const url = environment.apiUrl + 'article/get-user-articles';

    let params = new HttpParams()
    .append('PageSize', pageSize.toString())
    .append('PageNumber', pageIndex.toString());

    return getPaginatedResult<GetMyArticleInterface[]>(url, params, this.http);
  }

  postMyArticle(data: PostArticleInterface) : Observable<Guid> {
    const url = environment.apiUrl + 'article/create-article';

    return this.http.post<Guid>(url, data.article);
  }

  putMyArticle(data: PutArticleInterface) : Observable<void> {
    const url = environment.apiUrl + 'article/update-article';
    
    return this.http.put<void>(url, data.article);
  }

  deleteMyArticle(id: Guid): Observable<void>{
    const url = environment.apiUrl + 'article/delete-article';
    let params = new HttpParams().append('id', id.toString());

    return this.http.delete<void>(url, {params});
  }
 
}
