import {
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { PresenceService } from 'src/app/core/services/presence.service';
import { UserService } from 'src/app/core/services/user.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ChatInterface } from '../models/chat.interface';
import { MessageInterface } from '../models/message.interface';
import { SentMessageInterface } from '../models/sentMessage.interface';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messageForm!: FormGroup;
  recipientId!: Guid;
  chatName!: ChatInterface;
  messagesList!: MessageInterface[];
  imageUrl: string = '../../../../../assets/noProfile.jpg';
  anotherUsername!: string;
  @ViewChild('scroll') private scrollContainer!: ElementRef;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    public readonly chatService: ChatService,
    private readonly toastrService: ToastrService,
    private readonly userService: UserService,
    private readonly router: Router,
    public readonly presenceService: PresenceService,
    private readonly localStorage: LocalStorageService
  ) {
    //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.paramMap.subscribe((params) => {
      if (this.recipientId) {
        this.ngOnDestroy();
        this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {
    this.initializeFrom();
    this.getRecipientId();
    this.getMessages();
    this.getMessagesFromHub();
  }
  ngOnDestroy(): void {
    this.chatService.stopHubConnection();
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

  scrollToBottom() {
    this.scrollContainer.nativeElement.scrollTop =
      this.scrollContainer.nativeElement.scrollHeight;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  getRecipientId(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.recipientId = Guid.parse(id);
    } else {
      this.recipientId = Guid.createEmpty();
    }
    const username = this.route.snapshot.paramMap.get('username');
    if (username !== null) {
      this.anotherUsername = username;
    }
  }

  getMessages(): void {
    this.chatService
      .getListOfMessagesFromGroup(this.recipientId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.messagesList = res.messages;
        },
        error: (err) => {
          this.router.navigate(['not-found']);
          this.toastrService.error(err.error, 'Error with getting messages');
        },
      });
  }
  getMessagesFromHub(): void {
    this.chatService.createHubConnection(
      this.localStorage.getJwtToken() || '',
      this.recipientId.toString(),
      this.anotherUsername
    );
  }

  sendMessage(): void {
    const request: SentMessageInterface = {
      recipientId: this.recipientId.toString(),
      content: this.messageForm.value.message.trim(),
    };
    if (this.messageForm.value.message.trim()) {
      this.chatService.sentMessage(request).then(() => {
        this.messageForm.clearValidators();
        this.messageForm.markAsUntouched();
        this.messageForm.reset();
        this.initializeFrom();
      });

      /*this.chatService
        .sentMessage(request)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            this.messageForm.clearValidators();
            this.messageForm.markAsUntouched();
            this.messageForm.reset();
            this.initializeFrom();
            this.getMessages();
          },
          error: (err) => {
            this.initializeFrom();
            this.messageForm.clearValidators();
            this.messageForm.markAsUntouched();
            this.messageForm.reset();
            this.toastrService.error(err.error, 'Error with sending message!');
          },
        });
        */
    }
  }
  openUserProfile(id: Guid): void {
    this.router.navigate(['user-profile', id.toString()]);
  }
}
