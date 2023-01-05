import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

declare var FB: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  isAuthentificated!: boolean;
  isAdmin!: boolean;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private readonly toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.checkAuth();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  checkAuth(): void {
    this.authService.isUserLogged
      .pipe(
        tap((res) => (this.isAuthentificated = res)),
        switchMap(() => this.authService.isAdmin),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (res) => {
          this.isAdmin = res;
        },
        error: (err) =>
          this.toastrService.error(err.error, 'Error with check auth'),
      });
  }

  logout(): void {
    this.authService.logOut();
    FB.getLoginStatus(function (response: any) {
      if (response.status == 'connected') {
        FB.logout();
      }
    });
  }
}
