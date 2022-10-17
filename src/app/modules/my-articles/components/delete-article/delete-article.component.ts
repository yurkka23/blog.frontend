import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { MyArticlesService } from '../../services/my-articles.service';

@Component({
  selector: 'app-delete-article',
  templateUrl: './delete-article.component.html',
  styleUrls: ['./delete-article.component.scss']
})
export class DeleteArticleComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<void> = new Subject<void>();
  
  constructor(private readonly myArticlesService: MyArticlesService,
    @Inject(MAT_DIALOG_DATA) public deleteData: Guid,
    private readonly dialogRef: MatDialogRef<DeleteArticleComponent>,
    private readonly toastrService: ToastrService
    ) { }

  ngOnInit(): void {
  }
  ngOnDestroy(): void{
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  deleteArticle():void{
    this.myArticlesService.deleteMyArticle(this.deleteData)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: () => {
        this.toastrService.success('You deleted the article', 'Success!');
        this.dialogRef.close('delete');
      },
      error: err =>{
        this.toastrService.error(err.error, 'Error with delete article');
      }
    });
  }

}
