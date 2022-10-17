import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, finalize, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CurrentUserInterface } from 'src/app/shared/models/currentUser.interface';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit, OnDestroy {

  users!: CurrentUserInterface[];
  admins!: CurrentUserInterface[];
  searchInput = new FormControl('');
  isLoadingSearch: boolean = false;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly adminService: AdminService, 
    private readonly router: Router,
    private readonly toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getUsers();
    this.getAdmins();
    this.searchUsers();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getUsers(): void{
    this.isLoadingSearch = true;
    this.adminService.getUsers()
      .pipe(
        finalize(() => this.isLoadingSearch = false),
        takeUntil(this.unsubscribe$)
        )
      .subscribe({
      next: res =>{
        this.users = res.users;
      },
      error: err =>{
        this.toastrService.error(err.error, 'Error with getting users');
      }
    });
  }

  getAdmins(): void{
    this.isLoadingSearch = true;
    this.adminService.getAdmins()
      .pipe(
        finalize(() => this.isLoadingSearch = false),
        takeUntil(this.unsubscribe$)
        )
      .subscribe({
      next: res =>{
        this.admins = res.users;
      },
      error: err =>{
        this.toastrService.error(err.error, 'Error with getting admins');
      }
    });
  }

  searchUsers(): void{
    this.searchInput.valueChanges
      .pipe(
        tap(() => this.isLoadingSearch = true),
        debounceTime(500),
        switchMap(val => {
          return this.adminService.searchUsers(val?.trim() ? val : '')
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
      next: res =>{
        this.users = res.users;
        this.isLoadingSearch = false
      },
      error: err =>{
        this.toastrService.error(err.error, 'Error with searching for users');

      }
    });
  }
  
  reloadData(): void{
    this.getUsers();
    this.getAdmins();
  }
}

