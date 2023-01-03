import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { CurrentUserInterface } from 'src/app/shared/models/currentUser.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { MyAcountService } from '../../services/my-acount.service';

@Component({
  selector: 'app-my-acount',
  templateUrl: './my-acount.component.html',
  styleUrls: ['./my-acount.component.scss'],
})
export class MyAcountComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  currentUser!: CurrentUserInterface;
  imageUser: string = '../../../../../assets/noProfile.jpg';
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private readonly userService: UserService,
    private readonly myAcountService: MyAcountService,
    private readonly toastrService: ToastrService,
    private readonly router: Router,
    private readonly localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.initializeData();
    this.reloadData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeData(): void {
    this.isLoading = true;
    this.userService
      .getCurentUserInfo()
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (res) => {
          this.currentUser = res;
          console.log(this.currentUser);
          if (res.imageUserUrl !== '') {
            this.imageUser = res.imageUserUrl;
          }
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Error with getting info user');
        },
      });
  }

  reloadData(): void {
    this.myAcountService.reloadData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          if (res) {
            this.initializeData();
          }
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Error with reloading data');
        },
      });
  }

  openUserProfile(): void {
    if (this.localStorage.getUser()?.id) {
      this.router.navigate(['user-profile', this.localStorage.getUser()?.id]);
    }
  }
}
