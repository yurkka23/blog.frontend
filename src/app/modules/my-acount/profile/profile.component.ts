import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, takeUntil } from 'rxjs';
import { PresenceService } from 'src/app/core/services/presence.service';
import { UserService } from 'src/app/core/services/user.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ArticleInterface } from '../../all-articles/models/Article.interface';
import { GetArticlesInterface } from '../../all-articles/models/GetArticles.interface';
import { ArticlesService } from '../../all-articles/services/articles.service';
import { ChatService } from '../../chats/services/chat.service';
import { GetMyArticleInterface } from '../../my-articles/models/GetMyArticle.interface';
import { ProfileUserInterface } from '../../user-profile/models/ProfileUser.interface';
import { CreateSubscriptionDTO } from '../models/CreateSubscriptionDTO.interface';
import { SubscriptionService } from '../services/subscription.service';
import { SentMessageComponent } from './sent-message/sent-message.component';
import { ShowFollowersComponent } from './show-followers/show-followers.component';
import { ShowFollowingsComponent } from './show-followings/show-followings.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userId!: Guid;
  profileUser!: ProfileUserInterface;
  isLoading: boolean = false;
  isProfileCurrentUser: boolean = false;
  imageUser: string = '../../../../../assets/noProfile.jpg';
  userArticles!: ArticleInterface[];
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly toastrService: ToastrService,
    private readonly localStorage: LocalStorageService,
    private readonly matDialog: MatDialog,
    private readonly subscriptionService: SubscriptionService,
    private readonly articlesService: ArticlesService,
    private readonly router: Router,
    private readonly chatService: ChatService,
    public readonly presenceService: PresenceService
  ) {}

  ngOnInit(): void {
    this.getUserId();
    this.getUserProfile();
    this.getUserArticles();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getUserId(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.userId = Guid.parse(id);
    } else {
      this.userId = Guid.createEmpty();
    }

    //check Is Profile CurrentUser
    if (Guid.parse(id ? id : Guid.EMPTY) == this.localStorage.getUser()?.id) {
      this.isProfileCurrentUser = true;
      console.log(this.isProfileCurrentUser);
    } else {
      this.isProfileCurrentUser = false;
    }
  }

  getUserArticles(): void {
    this.isLoading = true;
    this.articlesService
      .getAnotherUserArticles(this.userId)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (res) => {
          this.userArticles = res.articles;
        },
        error: (err) => {
          this.toastrService.error(
            err.error,
            'Error with getting user articles'
          );
        },
      });
  }

  getUserProfile(): void {
    this.isLoading = true;
    this.userService
      .getUserProfile(this.userId)
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (res) => {
          this.profileUser = res;
          if (res.avatarUrl !== '') {
            this.imageUser = res.avatarUrl;
          } else {
            this.imageUser = '../../../../../assets/noProfile.jpg';
          }
        },
        error: (err) => {
          this.toastrService.error(
            err.error,
            'Error with getting user profile!'
          );
        },
      });
  }

  showFollowers(): void {
    this.matDialog
      .open(ShowFollowersComponent, {
        data: this.userId,
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        if (val === 'showUser') {
          this.getUserId();
          this.getUserProfile();
          this.getUserArticles();
        }
      });
  }

  showFollowings(): void {
    this.matDialog
      .open(ShowFollowingsComponent, {
        data: this.userId,
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        if (val === 'showUser') {
          this.getUserId();
          this.getUserProfile();
          this.getUserArticles();
        }
      });
  }

  follow(): void {
    let data: CreateSubscriptionDTO = {
      UserToSubscribeId: this.userId.toString(),
    };

    this.isLoading = true;

    this.subscriptionService
      .follow(data)
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: () => {
          this.getUserProfile();
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Error with follow!');
        },
      });
  }

  unfollow(): void {
    this.isLoading = true;
    this.subscriptionService
      .unfollow(this.userId)
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: () => {
          this.getUserProfile();
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Error with unfollow!');
        },
      });
  }

  sentMessage(): void {
    this.chatService
      .getUserListOfChats()
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (res) => {
          let isChat = false;
          res.chats.forEach((chat) => {
            if (this.userId == chat.recipientUserId) {
              this.router.navigate([
                `chats/chat/${this.userId.toString()}/${
                  this.profileUser.username
                }`,
              ]);
              isChat = true;
            }
          });
          if (!isChat) {
            this.matDialog
              .open(SentMessageComponent, {
                data: this.userId,
              })
              .afterClosed()
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe((val) => {
                if (val === 'sent') {
                  this.router.navigate([
                    `chats/chat/${this.userId.toString()}/${
                      this.profileUser.username
                    }`,
                  ]);
                }
              });
          }
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Error with getting user chats');
        },
      });
  }

  openArticle(id: Guid): void {
    this.router.navigate(['all-articles/post-article', id]);
  }
}
