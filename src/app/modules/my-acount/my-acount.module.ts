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


@NgModule({
  declarations: [
    MyAcountComponent,
    DashboardComponent,
    SupportComponent,
    GivenRatingsComponent,
    EditProfileComponent,
    CardRatingComponent
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
    AppRoutingModule
  ]
})
export class MyAcountModule { }
