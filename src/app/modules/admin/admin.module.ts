import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { GeneralStatisticItemComponent } from './components/general-statistic-item/general-statistic-item.component';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VerifyArticleComponent } from './components/verify-article/verify-article.component';
import { AddAdminComponent } from './components/add-admin/add-admin.component';
import { CardArticleComponent } from './components/verify-article/card-article/card-article.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardUserComponent } from './components/add-admin/card-user/card-user.component';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    AdminPanelComponent,
    GeneralStatisticItemComponent,
    DashboardComponent,
    VerifyArticleComponent,
    AddAdminComponent,
    CardArticleComponent,
    CardUserComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatIconModule,
    SharedModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ]
})
export class AdminModule { }
