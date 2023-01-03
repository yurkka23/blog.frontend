import { Component, Input, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { PresenceService } from 'src/app/core/services/presence.service';
import { UserService } from 'src/app/core/services/user.service';
import { ChatInterface } from '../../models/chat.interface';

@Component({
  selector: 'app-chat-name',
  templateUrl: './chat-name.component.html',
  styleUrls: ['./chat-name.component.scss'],
})
export class ChatNameComponent implements OnInit {
  @Input() chat!: ChatInterface;
  @Input() chatId!: Guid;

  imageUrl: string = '../../../../../assets/noProfile.jpg';
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private readonly userService: UserService,
    private readonly toastrService: ToastrService,
    public readonly presenceService: PresenceService
  ) {}

  ngOnInit(): void {
    this.userService
      .getUserProfile(this.chatId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.chat.recipientUserId = this.chatId;
          this.chat.recipientAvatarUrl = res.avatarUrl;
          this.chat.recipientUsername = res.username;
        },
        error: (err) => {
          this.toastrService.error(
            err.error,
            'Error with getting info chat name'
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
