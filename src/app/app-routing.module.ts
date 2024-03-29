import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './core/guards/admin.guard';
import { LoggedInGuard } from './core/guards/logged-in.guard';
import { AboutUsComponent } from './modules/about-us/components/about-us/about-us.component';
import { AllArticlesComponent } from './modules/all-articles/components/all-articels/all-articles.component';
import { PostArticleComponent } from './modules/all-articles/components/post-article/post-article.component';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { RegisterComponent } from './modules/auth/components/register/register.component';
import { DashboardComponent } from './modules/my-acount/components/dashboard/dashboard.component';
import { GivenRatingsComponent } from './modules/my-acount/components/given-ratings/given-ratings.component';
import { MyAcountComponent } from './modules/my-acount/components/my-acount/my-acount.component';
import { SupportComponent } from './modules/my-acount/components/support/support.component';
import { MyArticlesComponent } from './modules/my-articles/components/my-articles/my-articles.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ProfileComponent } from './modules/my-acount/profile/profile.component';
import { ShowFollowersComponent } from './modules/my-acount/profile/show-followers/show-followers.component';
import { ShowFollowingsComponent } from './modules/my-acount/profile/show-followings/show-followings.component';
import { FollowersComponent } from './modules/my-acount/components/followers/followers.component';
import { FollowingsComponent } from './modules/my-acount/components/followings/followings.component';

const routes: Routes = [
  {
    path: 'about-us',
    component: AboutUsComponent,
  },
  {
    path: 'my-acount',
    canActivate: [LoggedInGuard],
    component: MyAcountComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'support',
        component: SupportComponent,
      },
      {
        path: 'given-ratings',
        component: GivenRatingsComponent,
      },
      {
        path: 'followers',
        component: FollowersComponent,
      },
      {
        path: 'followings',
        component: FollowingsComponent,
      }
    ],
  },
  {
    path: 'my-articles',
    canActivate: [LoggedInGuard],
    component: MyArticlesComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin',
    canLoad: [AdminGuard],
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'chats',
    canActivate: [LoggedInGuard],
    loadChildren: () =>
      import('./modules/chats/chats.module').then((m) => m.ChatsModule),
  },
  {
    path: 'all-articles',
    component: AllArticlesComponent,
  },
  {
    path: 'all-articles/post-article/:id',
    component: PostArticleComponent,
  },
  {
    path: 'user-profile/:id',
    component: ProfileComponent,
  },
  {
    path: '',
    redirectTo: 'all-articles',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
