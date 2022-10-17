import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyAcountService {

  constructor() { }

  reloadData : Subject<boolean> = new Subject();
}
