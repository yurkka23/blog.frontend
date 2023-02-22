import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { map, Observable, Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { GetMyArticlesInterface } from '../../my-articles/models/GetMyArticles.interface';
import { ArticleInterface } from '../models/Article.interface';
import { GetArticlesInterface } from '../models/GetArticles.interface';
import { GetGenresInterface } from '../models/GetGenres.interface';
import { PaginatedResult } from '../models/PaginatedResult';
import { PostArticleInterface } from '../models/PostArticle.interface';
import { getPaginatedResult } from './pagination-helper.service';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  genreChoosed: Subject<string> = new Subject();

  constructor(
    private readonly http: HttpClient,
    private readonly localStorageService: LocalStorageService
  ) {}

  getArticles(pageSize: number = 8, pageIndex: number = 0): Observable<PaginatedResult<ArticleInterface[]>> {
    const url = environment.apiUrl + 'article/get-list-of-articles';
    let params = new HttpParams()
      .append('PageSize', pageSize.toString())
      .append('PageNumber', pageIndex.toString());

      return getPaginatedResult<ArticleInterface[]>(url, params, this.http)
      .pipe(map(response => {
        return response;
      }))
  }

  getTopArticles(): Observable<GetArticlesInterface> {
    const url = environment.apiUrl + 'article/get-top-articles';

    return this.http.get<GetArticlesInterface>(url);
  }

  getGenres(countGenre: number): Observable<GetGenresInterface> {
    const url = environment.apiUrl + 'article/get-article-genres';
    let params = new HttpParams().append('count', countGenre.toString());

    return this.http.get<GetGenresInterface>(url, { params });
  }

  getArticlesByGenre(genre: string,pageSize: number = 10, pageIndex: number = 0): Observable<PaginatedResult<ArticleInterface[]>> {
    if (genre === 'all') {
      return this.getArticles();
    }

    const url = environment.apiUrl + 'article/get-articles-by-genres';
    let params = new HttpParams()
    .append('PageSize', pageSize.toString())
    .append('PageNumber', pageIndex.toString())
    .append('genre', genre);

    return getPaginatedResult<ArticleInterface[]>(url, params, this.http);
  }

  getArticleById(id: Guid): Observable<PostArticleInterface> {
    const url = environment.apiUrl + 'article/get-article-content-by-id';
    let params = new HttpParams().append('id', id.toString());

    const userId = this.localStorageService.getUser()?.id;

    if (userId) {
      params = new HttpParams()
        .append('id', id.toString())
        .append('currentUserId', userId.toString());
    }

    return this.http.get<PostArticleInterface>(url, { params });
  }

  getAnotherUserArticles(id: Guid, pageSize: number = 8, pageIndex: number = 0): Observable<PaginatedResult<ArticleInterface[]>> {
    const url = environment.apiUrl + 'article/get-another-user-articles';
    let params = new HttpParams()
    .append('UserId', id.toString())
    .append('PageSize', pageSize.toString())
    .append('PageNumber', pageIndex.toString());

    return getPaginatedResult<ArticleInterface[]>(url, params, this.http);
  }
}
