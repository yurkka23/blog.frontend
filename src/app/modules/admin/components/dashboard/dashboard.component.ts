import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, takeUntil } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { StatisticsInterface } from '../../models/statistics.interface';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  statistics!: StatisticsInterface;
  fullName!: string; 
  isLoading: boolean = false;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly adminService: AdminService,
    private readonly toastrService: ToastrService,
    private readonly localStorageService: LocalStorageService) { }
  
    ngOnInit(): void {
      this.getStatistics();
      this.getFullName();
    }
  
    ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }

    getStatistics(): void{
      this.isLoading = true;
      this.adminService.getStatisctics()
        .pipe(
          finalize(() => this.isLoading = false),
          takeUntil(this.unsubscribe$)
          )
        .subscribe({
        next: res =>{
          this.statistics = res;
        },
        error: err =>{
          this.toastrService.error(err.error, 'Error with getting statistics');
        }
      });
    }

    getFullName(): void{
      const firstName = this.localStorageService.getUser()?.firstName ? this.localStorageService.getUser()?.firstName : '';
      const lastName = this.localStorageService.getUser()?.lastName ? this.localStorageService.getUser()?.lastName : '';
      this.fullName = firstName + ' ' + lastName;
    }
  
}
