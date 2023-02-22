import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoginRequestInterface } from '../../models/loginRequest.interface';
import { ToastrService } from 'ngx-toastr';
import { FacebookUserLoginInterface } from '../../models/facebookUserLogin.interface';

declare var FB: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal!: ElementRef;
  form!: FormGroup;
  isLoading: boolean = false;
  public errorMessage: string | undefined;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeFrom();
    this.initFacebookAuth();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initFacebookAuth(): void {
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '670488708108921',
        cookie: true,
        xfbml: true,
        version: 'v15.0',
      });

      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js: any,
        fjs: any = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');

    
  }

  loginWithFacebook() {
    FB.login(
      (response: any) => {
        if (response.authResponse) {
          let fields: string = '';
          if (response.authResponse.grantedScopes.includes('public_profile')) {
            fields += 'name,picture,birthday';
          }
          if (response.authResponse.grantedScopes.includes('email')) {
            fields += ',email';
          }
          FB.api(
            '/me',
            (response: any) => {
              let data: FacebookUserLoginInterface = {
                id: response.id,
                email: response.email || null,
                firstName: response.name.split(' ')[0],
                lastName: response.name.split(' ')[1],
                avatarUrl: response.picture.data.url || '',
              };
              this.authService
                .loginWithFacebook(data)
                .pipe(
                  finalize(() => (this.isLoading = false)),
                  takeUntil(this.unsubscribe$)
                )
                .subscribe({
                  next: (_) => {
                    this.toastrService.success(
                      'You successfully logged!',
                      'Success!'
                    );
                    this.router.navigate(['']);
                  },
                  error: (err) => {
                    this.toastrService.error(err.error, 'Error with logging!');
                    this.errorMessage = err.error;
                  },
                });
            },
            {
              fields: fields,
            }
          );
        } else {
          this.toastrService.error('Login using facebook failed');
        }
      },
      {
        enable_profile_selector: true,
        return_scopes: true,
        return_fields: true,
        scope: 'public_profile,email',
        auth_type: 'rerequest',
      }
      // true //to everytime when login enter password
    );
  }

  closeModal(event: Event): void {
    if (!this.modal.nativeElement.contains(event.target)) {
      this.router.navigate(['']);
    }
  }

  initializeFrom(): void {
    this.form = this.fb.group({
      userName: this.fb.control('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  onSubmit(): void {
    const request: LoginRequestInterface = {
      user: this.form.value,
    };
    this.isLoading = true;
    this.authService
      .login(request)
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (_) => {
          this.toastrService.success('You successfully logged!', 'Success!');
          this.router.navigate(['']);
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Error!');
          this.errorMessage = err.error;
        },
      });
  }

  openRegister(): void {
    this.router.navigate(['register']);
  }
}
