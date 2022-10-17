
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { PostArticleInterface } from '../../models/PostArticle.interface';
import { MyArticlesService } from '../../services/my-articles.service';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent implements OnInit, OnDestroy {
  articeForm!: FormGroup;
  public errorMessage: string | undefined;
  public errorStatus: string | undefined;
  image: string ='../../../../../assets/noPhoto.jpg'; 
  isPicture: boolean = false;
  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly fb: FormBuilder,
    private readonly myArticlesService: MyArticlesService,
    private readonly dialogRef: MatDialogRef<CreateArticleComponent>,
    private readonly storage: AngularFireStorage,
    private readonly toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeFrom();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initializeFrom():void {
    this.articeForm = this.fb.group({
      title: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
      content: this.fb.control('', [Validators.required, Validators.maxLength(1000)]),
      genre: this.fb.control('', [Validators.required, Validators.maxLength(15)]),
    });
  }

  onSubmit():void{
    const request: PostArticleInterface = {
      article : {
        articleImageUrl : this.image,
        ...this.articeForm.value
      }
    }

    this.myArticlesService.postMyArticle(request)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe({next: res =>{
      this.toastrService.success('You have created an article', 'Success');
      this.articeForm.reset();
      this.dialogRef.close('add');
    },
    error: err =>{
      this.toastrService.error(err.error, 'Error with creating article')
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
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({next: url => {
        this.image = url;
        this.isPicture = true;
      },
      error: err=>{
        this.toastrService.error(err.error, 'Error with uploading photo')
        this.errorMessage = err.message;
        this.errorStatus = err.status;
      }});
    });
  }

}
