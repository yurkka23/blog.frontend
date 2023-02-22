import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ArticleInterface } from 'src/app/modules/all-articles/models/Article.interface';

import { GetArticlesInterface } from 'src/app/modules/all-articles/models/GetArticles.interface';
import { PaginatedResult } from 'src/app/modules/all-articles/models/PaginatedResult';
import { ArticlesService } from 'src/app/modules/all-articles/services/articles.service';
import { getPaginatedResult } from 'src/app/modules/all-articles/services/pagination-helper.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private readonly http: HttpClient, private readonly articlesService: ArticlesService) { }

  searchArticles(partTitle: string, pageSize: number = 10, pageIndex: number = 0): Observable<PaginatedResult<ArticleInterface[]>>{
    const url = environment.apiUrl + 'article/search-articles-by-title';
    
    if(!partTitle || partTitle.trim() === ''){
      return this.articlesService.getArticles(pageSize,pageIndex);
    }
    let params = new HttpParams().append('partTitle', partTitle.toString())
    .append('PageSize', pageSize.toString())
    .append('PageNumber', pageIndex.toString());;

    return getPaginatedResult<ArticleInterface[]>(url, params, this.http)
    .pipe(map(response => {
      return response;
    }))
  }
}
