import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UsersInterface } from 'src/app/modules/admin/models/users.interface';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-show-followings',
  templateUrl: './show-followings.component.html',
  styleUrls: ['./show-followings.component.scss'],
})
export class ShowFollowingsComponent implements OnInit, OnDestroy {
  listFollowers!: UsersInterface;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private readonly subscriptionService: SubscriptionService,
    @Inject(MAT_DIALOG_DATA) public userId: Guid,
    private readonly dialogRef: MatDialogRef<ShowFollowingsComponent>,
    private readonly toastrService: ToastrService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getFollowings();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getFollowings(): void {
    this.subscriptionService
      .getFollowingsById(this.userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.listFollowers = res;
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Error with getting followings');
        },
      });
  }
  showUserProfile(id: Guid): void {
    this.router.navigate(['user-profile', id]);
    this.dialogRef.close('showUser');
  }
}
