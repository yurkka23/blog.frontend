import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { GetMyArticleInterface } from '../../models/GetMyArticle.interface';
import { PutArticleInterface } from '../../models/PutArticle.interface';
import { MyArticlesService } from '../../services/my-articles.service';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit, OnDestroy {
  articeForm!: FormGroup;
  public errorMessage: string | undefined;
  public errorStatus: string | undefined;
  image: string = this.editData.articleImageUrl;
  private unsubscribe$: Subject<void> = new Subject<void>(); 
  
  constructor(private readonly fb: FormBuilder,
    private readonly myArticlesService: MyArticlesService,
    private readonly dialogRef: MatDialogRef<EditArticleComponent>,
    private readonly storage: AngularFireStorage,
    @Inject(MAT_DIALOG_DATA) public editData: GetMyArticleInterface,
    private readonly toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeFrom();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeFrom():void {
    this.articeForm = this.fb.group({
      title: this.fb.control(this.editData.title, [Validators.required, Validators.maxLength(50)]),
      content: this.fb.control(this.editData.content, [Validators.required, Validators.maxLength(1000)]),
      genre: this.fb.control(this.editData.genre, [Validators.required, Validators.maxLength(15)]),
    });
  }

  onSubmit():void{
    const request: PutArticleInterface = {
      article : {
        articleImageUrl : this.image,
        id : this.editData.id,
        ...this.articeForm.value
      }
    }
    this.myArticlesService.putMyArticle(request)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({next: res =>{
      this.toastrService.success('You have edited the article','Success');
      this.articeForm.reset();
      this.dialogRef.close('edit');
    },
    error: err =>{
      this.toastrService.error(err.error,'Error with editing article');
      this.errorStatus = err.status;
      this.errorMessage= err.message;
    }
  })
  }

  
  uploadFile(event: any): void{
    const file = event.target.files[0];
    const filePath =`images/${file.name}`;
    const task = this.storage.upload(filePath, file);
    task.then(image => {
      this.storage.ref(`images/${image.metadata.name}`)
      .getDownloadURL()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({next: url => {
        this.image = url;
      },error: err=>{
        this.toastrService.error(err.error,'Error with upload photo');
        this.errorMessage = err.message;
        this.errorStatus = err.status;
      }});
    });
  }
}
