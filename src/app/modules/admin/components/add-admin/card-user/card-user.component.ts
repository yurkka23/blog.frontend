import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { CurrentUserInterface } from 'src/app/shared/models/currentUser.interface';
import { ChangeRoleInterface } from '../../../models/changeRole.interface';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-card-user',
  templateUrl: './card-user.component.html',
  styleUrls: ['./card-user.component.scss']
})
export class CardUserComponent implements OnInit , OnDestroy {

  @Input() userData!: CurrentUserInterface;
  @Output() reloadDataEvent = new EventEmitter<void>();
  userImage: string = '../../../../../assets/noProfile.jpg'; 
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly router: Router, 
    private readonly adminService: AdminService,
    private readonly toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getUserImage();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getUserImage(): void{
    if(this.userData.imageUserUrl !== ''){
      this.userImage = this.userData.imageUserUrl;
    }
  }

  makeAdmin(UserId: Guid):void{
    const request: ChangeRoleInterface = {
      userId : UserId
    }
    this.adminService.makeAdmin(request)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
      next: () =>{
        this.toastrService.success('You changed role to user', 'Success!');
        this.reloadDataEvent.emit();
      },
      error: err =>{
        this.toastrService.error(err.error, 'Error!');
      }
    });
  }
}
