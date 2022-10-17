import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { RatingService } from 'src/app/shared/services/rating.service';
import { RatingInterface } from '../../models/Rating.interface';

@Component({
  selector: 'app-add-rating',
  templateUrl: './add-rating.component.html',
  styleUrls: ['./add-rating.component.scss']
})
export class AddRatingComponent implements OnInit,OnDestroy {

  indexChosen: number = -1;
  options: string[] = ['Very bad','Bad', 'Not bad', 'Good', 'Excellent'];
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly dialogRef: MatDialogRef<AddRatingComponent>,
    @Inject(MAT_DIALOG_DATA) public articleId: Guid,
    private readonly ratingService: RatingService,
    private readonly toastrService: ToastrService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addRating(): void{
    let rating = this.indexChosen;
   
    const request: RatingInterface = {
      ArticleId: this.articleId.toString(),
      Score: ++rating
    }

    this.ratingService.postRating(request)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({next: res =>{
      this.toastrService.success('You have added a rating', 'Success!');
      this.dialogRef.close('add');
    },
    error: err =>{
      this.toastrService.success(err.error, 'Error with adding a rating!');
    }
  })
  }
}
