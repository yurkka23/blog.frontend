import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UsersInterface } from 'src/app/modules/admin/models/users.interface';
import { SubscriptionService } from '../../services/subscription.service';
import { ShowFollowingsComponent } from '../show-followings/show-followings.component';

@Component({
  selector: 'app-show-followers',
  templateUrl: './show-followers.component.html',
  styleUrls: ['./show-followers.component.scss'],
})
export class ShowFollowersComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject<void>();
  listFollowers!: UsersInterface;

  constructor(
    private readonly subscriptionService: SubscriptionService,
    @Inject(MAT_DIALOG_DATA) public userId: Guid,
    private readonly dialogRef: MatDialogRef<ShowFollowingsComponent>,
    private readonly toastrService: ToastrService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getFollowers();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getFollowers(): void {
    this.subscriptionService
      .getFollowersById(this.userId)
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
