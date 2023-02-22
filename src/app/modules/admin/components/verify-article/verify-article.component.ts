import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, finalize, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ArticleInterface } from 'src/app/modules/all-articles/models/Article.interface';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-verify-article',
  templateUrl: './verify-article.component.html',
  styleUrls: ['./verify-article.component.scss']
})
export class VerifyArticleComponent implements OnInit, OnDestroy {

  articles!: ArticleInterface[];
  searchInput = new FormControl('');
  isLoadingSearch: boolean = false;
  public totalCount!: number;
  public pageIndex: number = 0;
  public pageSize: number = 8;
  public readonly pageSizeOptions: number[] = [8, 16, 32];
  private lastSearch: string = "";
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly adminService: AdminService,
    private readonly router: Router,
    private readonly toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getArticles();
    this.searchArticles();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  getArticles(): void{
    this.isLoadingSearch = true;
    this.adminService.getWaitingArticles()
      .pipe(
        finalize(() => this.isLoadingSearch = false),
        takeUntil(this.unsubscribe$)
        )
      .subscribe({
      next: res =>{
        this.articles = res.result ?? [];
        this.totalCount = res.pagination?.totalItems ?? 0;
      },
      error: err =>{
        this.toastrService.error(err.error, 'Error with getting articles');
      }
    });
  }

  searchArticles(pageSize: number = 8, pageIndex: number = 0): void{
    this.searchInput.valueChanges
      .pipe(
        tap(() => this.isLoadingSearch = true),
        debounceTime(500),
        switchMap(val => {
          this.lastSearch = val ?? '';
          return this.adminService.searchWaitingArticles(val?.trim() ? val : '', pageSize, pageIndex)
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
      next: res =>{
        this.articles = res.result ?? [];
        this.totalCount = res.pagination?.totalItems ?? 0;
        this.isLoadingSearch = false;
      },
      error: err =>{
        this.toastrService.error(err.error, 'Error with searching articles');
      }
    });
  }

  searchPaginateArticles(searchVal: string ,pageSize: number = 8, pageIndex: number = 0): void {
     this.adminService.searchWaitingArticles( searchVal, pageSize, pageIndex)
     .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
      next: res =>{
        this.articles = res.result ?? [];
        this.totalCount = res.pagination?.totalItems ?? 0;
        this.isLoadingSearch = false;
      },
      error: err =>{
        this.toastrService.error(err.error, 'Error with searching articles');
      }
    });
  }

  reloadData(): void{
    this.getArticles();
  }

  public paginatorEvent(event: PageEvent): void {
    this.pageIndex = 0;
   
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.searchPaginateArticles(this.lastSearch, event.pageSize, event.pageIndex);
  }
}
