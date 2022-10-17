import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Subject, takeUntil } from 'rxjs';
import { GetMyArticleInterface } from '../../models/GetMyArticle.interface';
import { DeleteArticleComponent } from '../delete-article/delete-article.component';
import { EditArticleComponent } from '../edit-article/edit-article.component';

@Component({
  selector: 'app-my-article',
  templateUrl: './my-article.component.html',
  styleUrls: ['./my-article.component.scss']
})
export class MyArticleComponent implements OnInit, OnDestroy {

  @Input() article!: GetMyArticleInterface;
  @Output() reloadDataEvent = new EventEmitter<void>();
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly matDialog: MatDialog,
    private readonly router: Router) { }

  ngOnInit(): void {
    
  }
  ngOnDestroy(): void{
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openDeleteArticle(id: Guid){
    this.matDialog.open(DeleteArticleComponent,{
      data: id
    })
    .afterClosed()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(val => {
      if(val === 'delete'){
        this.reloadDataEvent.emit();
      }
    })
  }

  openEditArticle(article: GetMyArticleInterface){
    this.matDialog.open(EditArticleComponent,{
      data: article
    })
    .afterClosed()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(val => {
      if(val === 'edit'){
        this.reloadDataEvent.emit();
      }
    })
  }
  
  openArticle(id: Guid): void{
    this.router.navigate(['all-articles/post-article', id]);
  }
}
