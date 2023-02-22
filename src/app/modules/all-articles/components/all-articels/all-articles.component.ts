import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  finalize,
  map,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { SearchService } from 'src/app/shared/services/search.service';
import { ArticleInterface } from '../../models/Article.interface';
import { ArticlesService } from '../../services/articles.service';

@Component({
  selector: 'app-all-articles',
  templateUrl: './all-articles.component.html',
  styleUrls: ['./all-articles.component.scss'],
})
export class AllArticlesComponent implements OnInit, OnDestroy {
  articles!: ArticleInterface[];
  topArticles!: ArticleInterface[];
  searchInput = new FormControl('');
  isLoading: boolean = false;
  isLoadingSearch: boolean = false;
  private unsubscribe$: Subject<void> = new Subject<void>();
  public totalCount!: number;
  public pageIndex: number = 0;
  public pageSize: number = 8;
  public readonly pageSizeOptions: number[] = [8, 16, 32];
  private whatPaginate: string = 'all';//'search', 'byGenre';
  private searchValLast!: string ;
  private genreValLast!: string ;


  constructor(
    private readonly articlesService: ArticlesService,
    private readonly searchService: SearchService,
    private readonly router: Router,
    private readonly toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getTopArticles();
    this.getArticles(this.pageSize, this.pageIndex);
    this.searchArticles(this.pageSize, this.pageIndex);
    this.getArticlesByGenre(this.pageSize, this.pageIndex);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
  getArticlesByGenre(pageSize: number = 8, pageIndex: number = 0): void {
    this.articlesService.genreChoosed
      .pipe(
        tap(_ => {
          this.pageSize = pageSize;
          this.pageIndex = pageIndex;
        }),
        switchMap((val) => {
          if(val == 'all'){
            this.whatPaginate = 'all';
            this.getArticles();
          }else{
            this.genreValLast = val?.trim() ?? '';
            return this.articlesService.getArticlesByGenre(val,pageSize, pageIndex);
          }
          return [];
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (res) => {
          this.whatPaginate = 'byGenre'
          this.articles = res.result ?? [];
          this.totalCount = res.pagination?.totalItems ?? 0;
        },
        error: (err) => {
          this.toastrService.error(
            err.error,
            'Error with getting articles by genre'
          );
        },
      });
  }

  getPaginatedArticlesByGenre(pageSize: number = 8, pageIndex: number = 0): void {
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;

    if(this.genreValLast == 'all'){
      this.whatPaginate = 'all';
      this.getArticles();
    }else{
      this.articlesService.getArticlesByGenre(this.genreValLast, pageSize, pageIndex).pipe(
        takeUntil(this.unsubscribe$)
      )
        .subscribe({
          next: (res) => {
            this.whatPaginate = 'byGenre'
            this.articles = res.result ?? [];
            this.totalCount = res.pagination?.totalItems ?? 0;
            this.isLoadingSearch = false;
          },
          error: (err) => {
            this.toastrService.error(err.error, 'Error with getting articles by genre');
          },
        });
    }
  }

  getTopArticles(): void {
    this.isLoading = true;
    this.articlesService
      .getTopArticles()
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (res) => {
          this.topArticles = res.articles;
        },
        error: (err) => {
          this.toastrService.error(
            err.error,
            'Error with getting top articles'
          );
        },
      });
  }

  getArticles(pageSize: number = 8, pageIndex: number = 0): void {
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;

    this.articlesService
      .getArticles(pageSize, pageIndex)
      .pipe(
        takeUntil(this.unsubscribe$)
        )
      .subscribe({
        next: (res) => {
          this.whatPaginate = 'all';
          this.articles = res.result ?? [];
          this.totalCount = res.pagination?.totalItems ?? 0;
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Error with getting articles');
        },
      });
  }

  searchArticles(pageSize: number = 8, pageIndex: number = 0): void {
    this.searchInput.valueChanges
      .pipe(
        tap(() => (this.isLoadingSearch = true)),
        debounceTime(500),
        switchMap((val) => {
          this.pageSize = pageSize;
          this.pageIndex = pageIndex;
          this.searchValLast = val?.trim() ?? '';
          return this.searchService.searchArticles(val?.trim() ? val : '', pageSize, pageIndex);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (res) => {
          this.whatPaginate = 'search'
          this.articles = res.result ?? [];
          this.totalCount = res.pagination?.totalItems ?? 0;
          this.isLoadingSearch = false;
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Error with searching articles');
        },
      });

  }

  searchPaginateArticle(pageSize: number = 8, pageIndex: number = 0): void { 
    this.searchService.searchArticles(this.searchValLast, pageSize, pageIndex).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe({
        next: (res) => {
          this.whatPaginate = 'search'
          this.articles = res.result ?? [];
          this.totalCount = res.pagination?.totalItems ?? 0;
          this.isLoadingSearch = false;
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Error with searching articles');
        },
      });
  }

  openArticle(id: Guid): void {
    this.router.navigate(['all-articles/post-article', id]);
  }

  public paginatorEvent(event: PageEvent): void {
    this.pageIndex = 0;
   
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    if(this.whatPaginate == 'all'){
      this.getArticles(event.pageSize, event.pageIndex);
    }
    
    if(this.whatPaginate == 'search'){
      this.searchPaginateArticle(event.pageSize, event.pageIndex);
    }

    if(this.whatPaginate == 'byGenre'){
      this.getPaginatedArticlesByGenre(event.pageSize, event.pageIndex);
    }
  }
}
