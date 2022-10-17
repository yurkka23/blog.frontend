import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, takeUntil } from 'rxjs';
import { RatingService } from 'src/app/shared/services/rating.service';
import { MyRatingInterface } from '../../models/myRating.interface';

@Component({
  selector: 'app-given-ratings',
  templateUrl: './given-ratings.component.html',
  styleUrls: ['./given-ratings.component.scss']
})
export class GivenRatingsComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  ratingsList!: MyRatingInterface[];  
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor( private readonly ratingService: RatingService,
     private readonly router: Router,
     private readonly toastrService: ToastrService
     ) {} 

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeData(): void{
    this.isLoading = true;
    this.ratingService.getMyRaitngs()
     .pipe(
      finalize(() => this.isLoading = false),
      takeUntil(this.unsubscribe$)
      )
     .subscribe({next: res =>{
      this.ratingsList = res.ratings;
    },
    error: err =>{
      this.toastrService.error(err.error, 'Error with getting ratings');
    }
  });
  }

  openArticle(id: Guid): void{
    this.router.navigate(['all-articles/post-article', id]);
  }
  
}
