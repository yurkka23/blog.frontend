import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyAcountComponent } from './components/my-acount/my-acount.component';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SupportComponent } from './components/support/support.component';
import { GivenRatingsComponent } from './components/given-ratings/given-ratings.component';
import { MatButtonModule } from '@angular/material/button';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CardRatingComponent } from './components/given-ratings/card-rating/card-rating.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ShowFollowersComponent } from './profile/show-followers/show-followers.component';
import { ShowFollowingsComponent } from './profile/show-followings/show-followings.component';
import { UserFollowComponent } from './profile/user-follow/user-follow.component';
import { AllArticlesModule } from '../all-articles/all-articles.module';
import { SentMessageComponent } from './profile/sent-message/sent-message.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FollowersComponent } from './components/followers/followers.component';
import { FollowingsComponent } from './components/followings/followings.component';

@NgModule({
  declarations: [
    MyAcountComponent,
    DashboardComponent,
    SupportComponent,
    GivenRatingsComponent,
    EditProfileComponent,
    CardRatingComponent,
    ProfileComponent,
    ShowFollowersComponent,
    ShowFollowingsComponent,
    UserFollowComponent,
    SentMessageComponent,
    FollowersComponent,
    FollowingsComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    SharedModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    AppRoutingModule,
    AllArticlesModule,
    MatPaginatorModule
  ],
})
export class MyAcountModule {}
