import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  finalize,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { SearchService } from 'src/app/shared/services/search.service';
import { ArticleInterface } from '../../models/Article.interface';
import { ArticlesService } from '../../services/articles.service';

declare var FB: any;

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

  constructor(
    private readonly articlesService: ArticlesService,
    private readonly searchService: SearchService,
    private readonly router: Router,
    private readonly toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getTopArticles();
    this.getArticles();
    this.searchArticles();
    this.getArticlesByGenre();
    // this.initFacebookAuth();
    FB.Event.subscribe('auth.authResponseChange', function (response: any) {
      console.log('auth.authResponseChange');
      console.log(response);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  initFacebookAuth(): void {
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '670488708108921',
        cookie: true,
        xfbml: true,
        version: 'v15.0',
      });

      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js: any,
        fjs: any = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  getArticlesByGenre(): void {
    this.articlesService.genreChoosed
      .pipe(
        switchMap((val) => {
          return this.articlesService.getArticlesByGenre(val);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (res) => {
          this.articles = res.articles;
        },
        error: (err) => {
          this.toastrService.error(
            err.error,
            'Error with getting articles by genre'
          );
        },
      });
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

  getArticles(): void {
    this.articlesService
      .getArticles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.articles = res.articles;
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Error with getting articles');
        },
      });
  }

  searchArticles(): void {
    this.searchInput.valueChanges
      .pipe(
        tap(() => (this.isLoadingSearch = true)),
        debounceTime(500),
        switchMap((val) => {
          return this.searchService.searchArticles(val?.trim() ? val : '');
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (res) => {
          this.articles = res.articles;
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

  checkStatus(): void {
    FB.getLoginStatus(function (response: any) {
      console.log(response);
    });
  }
}
