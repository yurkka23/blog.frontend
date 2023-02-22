import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { GetMyArticleInterface } from '../../models/GetMyArticle.interface';
import { MyArticlesService } from '../../services/my-articles.service';
import { MatDialog } from '@angular/material/dialog';
import { MyArticleComponent } from '../my-article/my-article.component';
import { CreateArticleComponent } from '../create-article/create-article.component';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-my-articles',
  templateUrl: './my-articles.component.html',
  styleUrls: ['./my-articles.component.scss']
})
export class MyArticlesComponent implements OnInit, OnDestroy {

  myArticles!: GetMyArticleInterface[];
  countArticles: number = 0;
  isLoading: boolean = false;
  public totalCount!: number;
  public pageIndex: number = 0;
  public pageSize: number = 8;
  public readonly pageSizeOptions: number[] = [8, 16, 32];
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

  initialazeData(pageSize: number = 8, pageIndex: number = 0): void{
    this.isLoading = true;
    this.myArticlesService.getMyArticles(pageSize, pageIndex)
    .pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading = false),
      )
    .subscribe({next: res =>{
      this.totalCount = res.pagination?.totalItems ?? 0;
      this.myArticles = res.result ?? [];
      this.countArticles = res.result?.length ?? 0;
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
    this.pageSize = 8;
    this.pageIndex = 0;
    this.initialazeData(this.pageSize, this.pageIndex);
  }

  public paginatorEvent(event: PageEvent): void {
    this.pageIndex = 0;
   
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.initialazeData(event.pageSize, event.pageIndex);

  }
}
