import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
        this.articles = res.articles;
      },
      error: err =>{
        this.toastrService.error(err.error, 'Error with getting articles');
      }
    });
  }

  searchArticles(): void{
    this.searchInput.valueChanges
      .pipe(
        tap(() => this.isLoadingSearch = true),
        debounceTime(500),
        switchMap(val => {
          return this.adminService.searchWaitingArticles(val?.trim() ? val : '')
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
      next: res =>{
        this.articles = res.articles;
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
}
