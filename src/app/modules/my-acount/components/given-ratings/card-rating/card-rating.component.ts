import { Component, Input, OnInit } from '@angular/core';
import { MyRatingInterface } from '../../../models/myRating.interface';

@Component({
  selector: 'app-card-rating',
  templateUrl: './card-rating.component.html',
  styleUrls: ['./card-rating.component.scss']
})
export class CardRatingComponent implements OnInit {

  @Input() ratingInfo!: MyRatingInterface;
  constructor() { }

  ngOnInit(): void {
  }

}
