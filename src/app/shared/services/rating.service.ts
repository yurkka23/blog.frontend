import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { RatingInterface } from 'src/app/modules/all-articles/models/Rating.interface';
import { GetMyRatingsListInterface } from 'src/app/modules/my-acount/models/getMyRatingsList.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private readonly http: HttpClient) {}

  postRating(ratingData: RatingInterface): Observable<Guid> {
    const url = environment.apiUrl + 'rating/create-rating-to-article';

    return this.http.post<Guid>(url, ratingData);
  }

  getMyRaitngs(): Observable<GetMyRatingsListInterface> {
    const url = environment.apiUrl + 'rating/get-rating-list-by-user';

    return this.http.get<GetMyRatingsListInterface>(url);
  }
}
