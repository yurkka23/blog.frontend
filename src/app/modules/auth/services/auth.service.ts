import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequestInterface } from '../models/loginRequest.interface';
import { LoginResponseInterface } from '../models/loginResponse.interface';
import { RegisterRequestInterface } from '../models/registerRequest.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { TokensInterface } from '../models/tokens.interface';
import { RefreshTokenInterface } from '../models/refreshTokenRequest.interface';
import { Roles } from 'src/app/shared/enums/roles.enum';
import { ToastrService } from 'ngx-toastr';
import { PresenceService } from 'src/app/core/services/presence.service';
import { ChatService } from '../../chats/services/chat.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isUserLogged: BehaviorSubject<boolean> = new BehaviorSubject(
    !!this.localStorageService.getJwtToken()
  );
  isAdmin: BehaviorSubject<boolean> = new BehaviorSubject(
    this.localStorageService.getUser()?.role === Roles.Admin
  );

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly localStorageService: LocalStorageService,
    private readonly toastrService: ToastrService,
    private readonly presenceService: PresenceService,
    private readonly chatService: ChatService
  ) {}

  public checkAdmin(): void {
    if (!this.isUserLogged) {
      this.isAdmin.next(false);
    }
    this.isAdmin.next(this.localStorageService.getUser()?.role == Roles.Admin);
  }

  public register(data: RegisterRequestInterface): Observable<Guid> {
    const url = environment.apiUrl + 'auth/register';
    return this.http.post<Guid>(url, data.user).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public login(
    data: LoginRequestInterface
  ): Observable<LoginResponseInterface> {
    const url = environment.apiUrl + 'auth/login';
    return this.http.post<LoginResponseInterface>(url, data.user).pipe(
      map((response) => {
        const jwtToken = response.jwtToken;
        const refreshToken = response.refreshToken;
        this.localStorageService.setJwtToken(jwtToken);
        this.localStorageService.setRefreshToken(refreshToken);
        this.localStorageService.setUser(response.user);
        this.isUserLogged.next(true);
        this.checkAdmin();
        this.presenceService.createHubConnection(jwtToken);
        return response;
      })
    );
  }

  public refreshToken(data: RefreshTokenInterface): Observable<string> {
    const url = environment.apiUrl + 'auth/refresh-token';
    return this.http.post<TokensInterface>(url, data).pipe(
      map((response) => {
        const jwtToken = response.jwtToken;
        const refreshToken = response.refreshToken;
        this.localStorageService.setJwtToken(jwtToken);
        this.localStorageService.setRefreshToken(refreshToken);
        this.presenceService.createHubConnection(jwtToken);
        return response.jwtToken;
      })
    );
  }

  logOut(): void {
    this.localStorageService.clearAllData();
    this.isUserLogged.next(false);
    this.isAdmin.next(false);
    this.presenceService.stopHubConnection();
    this.chatService.stopHubConnection();
    this.toastrService.success('You logged out!');
    this.router.navigate(['all-articles']);
  }
}
