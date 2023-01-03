import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection } from '@microsoft/signalr';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, take } from 'rxjs';
import { CurrentUserInterface } from 'src/app/shared/models/currentUser.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(
    private readonly toastr: ToastrService,
    private readonly localStorage: LocalStorageService,
    private readonly router: Router
  ) {}

  createHubConnection(jwtToken: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => jwtToken,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((err) => console.log(err));

    this.hubConnection.on('UserIsOnline', (username) => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (usernames) =>
          this.onlineUsersSource.next([...usernames, username]),
      });
    });

    this.hubConnection.on('UserIsOffline', (username) => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (usernames) =>
          this.onlineUsersSource.next(usernames.filter((x) => x !== username)),
      });
    });

    this.hubConnection.on('GetOnlineUsers', (usernames) => {
      this.onlineUsersSource.next(usernames);
    });

    this.hubConnection.on(
      'NewMessageReceived',
      ({ username, userId, content }) => {
        this.toastr
          .info('You got message: ' + content, username)
          .onTap.pipe(take(1))
          .subscribe({
            next: () =>
              this.router.navigate([
                `chats/chat/${userId.toString()}/${username}`,
              ]),
          });
      }
    );
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch((err) => console.log(err));
  }
}
