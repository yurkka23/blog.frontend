import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, pipe, switchMap, tap, throwError } from 'rxjs';
import { RefreshTokenInterface } from 'src/app/modules/auth/models/refreshTokenRequest.interface';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private readonly localStorageService: LocalStorageService, private readonly authService:AuthService, private readonly http: HttpClient) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken =  this.localStorageService.getJwtToken();
      
      if(jwtToken) {
        req = req.clone({
          setHeaders: {Authorization: `Bearer ${jwtToken}`},
        });
      }

      return next.handle(req).pipe(
        catchError((response: HttpErrorResponse) => {
          if (response instanceof HttpErrorResponse && response.status === 401) {
            const idUser = this.localStorageService.getUser()?.id;
            const refreshToken = this.localStorageService.getRefreshToken();
            if(idUser && refreshToken){
              const data: RefreshTokenInterface = {
                id: idUser,
                refreshToken: refreshToken
              }
              return this.authService.refreshToken(data).pipe(
                map((token) => {
                  if (token) {
                    return req.clone({
                      setHeaders: { Authorization: `Bearer ${token}` },
                    });
                  } else {
                    throw response;
                  }
                }),
                switchMap((request) => next.handle(request)),
                catchError(() => {
                  this.authService.logOut();
                  return throwError(() => response);
                })
              );
            }else{
              this.authService.logOut();
              return throwError(() => response);
            }
          } else {
            return throwError(() => response);
          }
        })
      ); 
  }
}

