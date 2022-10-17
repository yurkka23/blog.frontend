import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { AuthModule } from './modules/auth/auth.module';
import { AllArticlesModule } from './modules/all-articles/all-articles.module';
import { MyAcountModule } from './modules/my-acount/my-acount.module';
import { MyArticlesModule } from './modules/my-articles/my-articles.module';
import { AboutUsModule } from './modules/about-us/about-us.module';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import {JwtModule} from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './core/interceptors/auth-interceptor.service';
import { SharedModule } from './shared/shared.module';
import { environment } from 'src/environments/environment';
import { AngularFireModule} from "@angular/fire/compat";
import { AngularFireStorageModule} from "@angular/fire/compat/storage";
import { AngularFireAuthModule} from "@angular/fire/compat/auth";
import { AngularFirestoreModule} from "@angular/fire/compat/firestore";
import { MatDialogModule } from "@angular/material/dialog";
import { NavigationModule } from './modules/navigation/navigation.module';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    AuthModule,
    AllArticlesModule,
    MyAcountModule,
    MyArticlesModule,
    AboutUsModule,
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem("jwtToken");
        },
        allowedDomains: ["http://localhost:4200/"],
      }
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    MatDialogModule,
    NavigationModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 9000,
      progressBar: true,
      closeButton: true
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
