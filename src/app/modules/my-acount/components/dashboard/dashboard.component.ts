import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { CurrentUserInterface } from 'src/app/shared/models/currentUser.interface';
import { MyAcountService } from '../../services/my-acount.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  currentUser!: CurrentUserInterface; 
  imageUser: string = '../../../../../assets/noProfile.jpg'; 
  private unsubscribe$: Subject<void> = new Subject<void>();
  
  constructor(private readonly userService: UserService, 
    private readonly matDialog: MatDialog, 
    private readonly router: Router, 
    private readonly myAcountService: MyAcountService,
    private readonly toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeData(): void{
    this.isLoading = true;
    this.userService.getCurentUserInfo()
     .pipe(
      finalize(() => this.isLoading = false),
      takeUntil(this.unsubscribe$)
      )
     .subscribe({next: res =>{
      this.currentUser = res;
    },
    error: err =>{
      this.toastrService.error(err.error, 'Error with getting current user')
    }
  });
  }

  openEditProfile(user: CurrentUserInterface){
    this.matDialog.open(EditProfileComponent,{
      data: user
    })
    .afterClosed()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(val => {
      if(val === 'edit'){
        this.initializeData();
        this.myAcountService.reloadData.next(true);
      }
    })
  }
  
  openMyArticles(){
    this.router.navigate(['my-articles']);
  }

}
