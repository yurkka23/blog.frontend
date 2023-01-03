import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { PresenceService } from './core/services/presence.service';
import { AuthService } from './modules/auth/services/auth.service';
import { LocalStorageService } from './shared/services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Blog';

  constructor(
    private readonly presenceService: PresenceService,
    private readonly localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    if (this.localStorage.getJwtToken()) {
      this.presenceService.createHubConnection(
        this.localStorage.getJwtToken() || ''
      );
    }
  }
  ngOnDestroy(): void {
    this.presenceService.stopHubConnection();
  }
}
