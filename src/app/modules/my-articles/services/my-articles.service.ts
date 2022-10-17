import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetMyArticlesInterface } from '../models/GetMyArticles.interface';
import { PostArticleInterface } from '../models/PostArticle.interface';
import { PutArticleInterface } from '../models/PutArticle.interface';

@Injectable({
  providedIn: 'root'
})
export class MyArticlesService {

  constructor(private readonly http: HttpClient) { }

  getMyArticles(): Observable<GetMyArticlesInterface>{
    const url = environment.apiUrl + 'article/get-user-articles';

    return this.http.get<GetMyArticlesInterface>(url);
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
