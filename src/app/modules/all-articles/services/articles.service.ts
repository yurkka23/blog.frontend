import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable, Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { GetMyArticlesInterface } from '../../my-articles/models/GetMyArticles.interface';
import { ArticleInterface } from '../models/Article.interface';
import { GetArticlesInterface } from '../models/GetArticles.interface';
import { GetGenresInterface } from '../models/GetGenres.interface';
import { PostArticleInterface } from '../models/PostArticle.interface';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  genreChoosed: Subject<string> = new Subject();

  constructor(
    private readonly http: HttpClient,
    private readonly localStorageService: LocalStorageService
  ) {}

  getArticles(): Observable<GetArticlesInterface> {
    const url = environment.apiUrl + 'article/get-list-of-articles';

    return this.http.get<GetArticlesInterface>(url);
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

  getArticlesByGenre(genre: string): Observable<GetArticlesInterface> {
    if (genre === 'all') {
      return this.getArticles();
    }

    const url = environment.apiUrl + 'article/get-articles-by-genres';
    let params = new HttpParams().append('genre', genre);

    return this.http.get<GetArticlesInterface>(url, { params });
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

  getAnotherUserArticles(id: Guid): Observable<GetArticlesInterface> {
    const url = environment.apiUrl + 'article/get-another-user-articles';
    let params = new HttpParams().append('id', id.toString());

    return this.http.get<GetArticlesInterface>(url, { params });
  }
}
