import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { SentMessageInterface } from 'src/app/modules/chats/models/sentMessage.interface';
import { ChatService } from 'src/app/modules/chats/services/chat.service';

@Component({
  selector: 'app-sent-message',
  templateUrl: './sent-message.component.html',
  styleUrls: ['./sent-message.component.scss'],
})
export class SentMessageComponent implements OnInit {
  messageForm!: FormGroup;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public userId: Guid,
    private readonly chatService: ChatService,
    private readonly toastrService: ToastrService,
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<SentMessageComponent>
  ) {}

  ngOnInit(): void {
    this.initializeFrom();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeFrom(): void {
    this.messageForm = this.fb.group({
      message: this.fb.control('', [
        Validators.required,
        Validators.maxLength(400),
      ]),
    });
  }

  sendMessage(): void {
    const request: SentMessageInterface = {
      recipientId: this.userId.toString(),
      content: this.messageForm.value.message.trim(),
    };
    if (this.messageForm.value.message.trim()) {
      /*this.chatService.sentMessage(request).then(() => {
        this.messageForm.clearValidators();
        this.messageForm.markAsUntouched();
        this.messageForm.reset();
        this.initializeFrom();
      });*/
      this.chatService
        .sentMessageFirst(request)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            this.dialogRef.close('sent');
          },
          error: (err) => {
            this.toastrService.error(err.error, 'Error with sending message!');
          },
        });
    }
  }
}
