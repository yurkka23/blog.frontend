import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UsersInterface } from 'src/app/modules/admin/models/users.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss']
})
export class FollowersComponent implements OnInit {

  private unsubscribe$: Subject<void> = new Subject<void>();
  listFollowers!: UsersInterface;
  userId!: Guid;

  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly toastrService: ToastrService,
    private readonly router: Router,
    private readonly storeService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.userId = Guid.parse(this.storeService.getUser()?.id.toString() ?? '' );
    this.getFollowers();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getFollowers(): void {
    debugger
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
  }

}
