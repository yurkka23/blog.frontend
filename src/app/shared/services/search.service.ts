import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetArticlesInterface } from 'src/app/modules/all-articles/models/GetArticles.interface';
import { ArticlesService } from 'src/app/modules/all-articles/services/articles.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private readonly http: HttpClient, private readonly articlesService: ArticlesService) { }

  searchArticles(partTitle: string): Observable<GetArticlesInterface>{
    const url = environment.apiUrl + 'article/search-articles-by-title';
    
    if(partTitle.trim() === ''){
      return this.articlesService.getArticles();
    }
    let params = new HttpParams().append('partTitle', partTitle.toString());

    return this.http.get<GetArticlesInterface>(url, {params});
  }
}
