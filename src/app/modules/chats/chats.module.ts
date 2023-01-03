import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatsRoutingModule } from './chats-routing.module';
import { DashboardChatsComponent } from './dashboard-chats/dashboard-chats.component';
import { ChatComponent } from './chat/chat.component';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChatNameComponent } from './dashboard-chats/chat-name/chat-name.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TimeagoModule } from 'ngx-timeago';

@NgModule({
  declarations: [DashboardChatsComponent, ChatComponent, ChatNameComponent],
  imports: [
    CommonModule,
    ChatsRoutingModule,
    MatIconModule,
    SharedModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    TimeagoModule.forRoot(),
  ],
})
export class ChatsModule {}
