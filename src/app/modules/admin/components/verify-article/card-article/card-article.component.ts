import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ArticleInterface } from 'src/app/modules/all-articles/models/Article.interface';
import { State } from 'src/app/modules/my-articles/enums/state.enum';
import { VerifyArticleInterface } from '../../../models/verifyArticle.interface';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-card-article',
  templateUrl: './card-article.component.html',
  styleUrls: ['./card-article.component.scss']
})
export class CardArticleComponent implements OnInit, OnDestroy {

  @Input() article!: ArticleInterface;
  @Output() reloadDataEvent = new EventEmitter<void>();
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly router: Router, 
    private readonly adminService: AdminService,
    private readonly toastrService: ToastrService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openArticle(id: Guid): void{
    this.router.navigate(['all-articles/post-article', id]);
  }

  verifyArticle(ArticleId: Guid):void{
    const request: VerifyArticleInterface ={
      id: ArticleId,
      state : State.Approved
    }
    this.adminService.verifyArticle(request)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
      next: () =>{
        this.toastrService.success('You have verified the article','Success!');
        this.reloadDataEvent.emit();
      },
      error: err =>{
        this.toastrService.error(err.error,'Error with verify article!');
      }
    });
  }

  rejectArticle(ArticleId: Guid):void{
    const request: VerifyArticleInterface ={
      id: ArticleId,
      state : State.Declined
    }
    this.adminService.verifyArticle(request)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
      next: () =>{
        this.toastrService.success('You have rejected the article','Success!');
        this.reloadDataEvent.emit();
      },
      error: err =>{
        this.toastrService.error(err.error,'Error with reject article!');
      }
    });
  }

  deleteArticle(ArticleId: Guid):void{
    this.adminService.deleteArticle(ArticleId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
      next: () =>{
        this.toastrService.success('You have deleted the article','Success!');
        this.reloadDataEvent.emit();
      },
      error: err =>{
        this.toastrService.error(err.error,'Error with delete article!');
      }
    });
  }
}
