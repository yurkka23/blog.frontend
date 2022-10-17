import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Roles } from 'src/app/shared/enums/roles.enum';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad {

  constructor(private readonly router: Router, private readonly localStorageService: LocalStorageService){}
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isAdmin: boolean = this.localStorageService.getUser()?.role == Roles.Admin ? true : false;  
    if(!isAdmin){
      this.router.navigate(['all-articles']);
      return false;
    }
    return true;
  }
}
