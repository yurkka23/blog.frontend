import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatNameComponent } from './dashboard-chats/chat-name/chat-name.component';
import { DashboardChatsComponent } from './dashboard-chats/dashboard-chats.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardChatsComponent,
    children: [
      {
        path: 'chat/:id/:username',
        component: ChatComponent,
      },
      /*{
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },*/
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatsRoutingModule {}
