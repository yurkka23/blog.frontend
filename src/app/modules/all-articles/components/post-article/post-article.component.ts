import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { CommentInterface } from '../../models/Comment.interface';
import { PostArticleInterface } from '../../models/PostArticle.interface';
import { PostCommentInterface } from '../../models/PostComment.interface';
import { ArticlesService } from '../../services/articles.service';
import { CommentsService } from '../../services/comments.service';
import { AddRatingComponent } from '../add-rating/add-rating.component';

@Component({
  selector: 'app-post-article',
  templateUrl: './post-article.component.html',
  styleUrls: ['./post-article.component.scss']
})
export class PostArticleComponent implements OnInit, OnDestroy {

  isAuthentificated!:boolean;
  isAdmin!:boolean;
  isCurrentUserAuthor: boolean = false; 
  articleId!: Guid;
  article!: PostArticleInterface;
  isLoading: boolean = false;
  isLoadingLocal: boolean = false;
  errorMessage!: string;
  authorPhoto: string = '../../../../../assets/noProfile.jpg';
  authorCommentPhoto: string = '../../../../../assets/noProfile.jpg';
  commentsList!: CommentInterface[];
  commentForm!: FormGroup;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly route: ActivatedRoute,
    private readonly articlesService: ArticlesService, 
    private readonly matDialog: MatDialog, 
    private readonly commentsService: CommentsService,
    private readonly localStorage: LocalStorageService,
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getArticleId();
    this.getArticle();
    this.getComments();
    this.initializeFrom();
    this.checkAuth();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  checkAuth(): void{
    this.authService.isUserLogged
    .pipe(
      tap((res)=> this.isAuthentificated = res),
      switchMap(() => this.authService.isAdmin),
      takeUntil(this.unsubscribe$)
      )
    .subscribe(
      {
        next: (res => {
          this.isAdmin = res;
        
        }),
        error: err => {
          this.toastrService.error(err.error, 'Error with auth!');
        }
      }
    )
  }

  initializeFrom():void {
    this.commentForm = this.fb.group({
      message: this.fb.control('', [Validators.required, Validators.maxLength(200)])
    });
  }

  getArticleId(): void{
    const id = this.route.snapshot.paramMap.get('id') ;
    if(id !== null){
      this.articleId = Guid.parse(id);
    }else{
      this.articleId = Guid.createEmpty();
    }
  }

  getArticle(): void{
    this.isLoading = true;
    this.articlesService.getArticleById(this.articleId)
     .pipe(
      finalize(() => this.isLoading = false),
      takeUntil(this.unsubscribe$)
      )
     .subscribe({next: res =>{
      this.article = res;
      if(res.authorImageUrl){
        this.authorPhoto = res.authorImageUrl;
      }
      if(res.createdBy == this.localStorage.getUser()?.id){
        console.log('true');
        this.isCurrentUserAuthor = true;
      }
    },
    error: err =>{
      this.toastrService.error(err.error, 'Error with getting article!')
    }
  });
  }

  getComments(): void{
    this.isLoadingLocal = true;
    this.commentsService.getComments(this.articleId)
     .pipe(
      finalize(() => this.isLoadingLocal = false),
      takeUntil(this.unsubscribe$)
      )
     .subscribe({next: res =>{
      this.commentsList = res.comments;
    },
    error: err =>{
      this.toastrService.error(err.error, 'Error with getting comments!')
    }
  });
  }

  openAddRating() : void{
    this.matDialog.open(AddRatingComponent,{
      data: this.articleId
    })
    .afterClosed()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(val => {
      if(val === 'add'){
        this.getArticle();
      }
    })
  }

  addComment():void{
    const request: PostCommentInterface = {
      ArticleId: this.articleId.toString(),
      Message: this.commentForm.value.message
    }

    this.commentsService.postComment(request)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({next: _ =>{
      this.toastrService.success('You have added a commment', 'Success!')
      this.commentForm.clearValidators();
      this.commentForm.markAsUntouched();
      this.commentForm.reset();
      this.initializeFrom();
      this.getComments();
    },
    error: err =>{
      this.toastrService.error(err.error, 'Error with adding comment!')
      this.errorMessage= err.message;
    }
  })
  }

  deleteCommet(id: number):void{
    this.commentsService.deleteComment(id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({next: () =>{
      this.toastrService.success('You have deleted a commment', 'Success!')
      this.getComments();
    },
    error: err =>{
      this.toastrService.error(err.error, 'Error with delete comment!')
    }
  })
  }

}
