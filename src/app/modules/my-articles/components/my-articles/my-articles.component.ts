import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { GetMyArticleInterface } from '../../models/GetMyArticle.interface';
import { MyArticlesService } from '../../services/my-articles.service';
import { MatDialog } from '@angular/material/dialog';
import { MyArticleComponent } from '../my-article/my-article.component';
import { CreateArticleComponent } from '../create-article/create-article.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-articles',
  templateUrl: './my-articles.component.html',
  styleUrls: ['./my-articles.component.scss']
})
export class MyArticlesComponent implements OnInit, OnDestroy {

  myArticles!: GetMyArticleInterface[];
  countArticles: number = 0;
  isLoading: boolean = false;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly myArticlesService: MyArticlesService, 
    private readonly matDialog: MatDialog,
    private readonly toastrService: ToastrService
    ) { }

  ngOnInit(): void {
    this.initialazeData();
  }

  ngOnDestroy(): void{
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initialazeData(): void{
    this.isLoading = true;
    this.myArticlesService.getMyArticles()
    .pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading = false),
      )
    .subscribe({next: res =>{
      this.myArticles = res.articles;
      this.countArticles = res.articles.length;
    },
    error: err =>{
      this.toastrService.error(err.error, 'Error with getting my articles');
    }
  });
  }

  openCreateArticle(){
    this.matDialog.open(CreateArticleComponent)
    .afterClosed()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(val => {
      if(val === 'add'){
        this.initialazeData();
      }
    })
  }

  reloadData(): void{
    this.initialazeData();
  }
}
