import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ListOfChatsInterface } from '../models/listOfChats.interface';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-dashboard-chats',
  templateUrl: './dashboard-chats.component.html',
  styleUrls: ['./dashboard-chats.component.scss'],
})
export class DashboardChatsComponent implements OnInit {
  isLoading: boolean = false;
  listOfChats!: ListOfChatsInterface;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private readonly toastrService: ToastrService,
    private readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.getUserChats();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getUserChats(): void {
    this.isLoading = true;
    this.chatService
      .getUserListOfChats()
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (res) => {
          this.listOfChats = res;
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Error with getting user chats');
        },
      });
  }
}
